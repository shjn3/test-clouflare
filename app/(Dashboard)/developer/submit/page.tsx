// src/app/dashboard/dev/submit/page.tsx
// gami-dev-adminaccount repo
// Requires: tailwind css + CSS module (SubmitGame.module.css)

'use client'


import { SUBMIT_FORM_TITLES } from '@/const/submitFormTitle'
import { useLoading } from '@/contexts/LoadingContext'
import { useToast } from '@/contexts/ToastContext'
import { useFileUpload } from '@/hooks/useFileUpload'
import createSupabaseBrowser from '@/libs/dev/DevSupabaseBrowser'
import { getFileExtension, getPathName } from '@/utils'
import { SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import styles from './SubmitGame.module.css'

const CATEGORIES = ['action', 'puzzle', 'racing', 'rpg', 'casual']
const MAX_SCREENSHOTS = 5
const MAX_ZIP_MB = 50
const MAX_ICON_MB = 2
const MAX_COVER_MB = 5
const MAX_SS_MB = 3
const MAX_VID_MB = 100

interface FormErrors {
    title?: string
    category?: string
    shortDesc?: string
    fullDesc?: string
    zip?: string
    icon?: string
    cover?: string
    screenshots?: string
    trailer?: string
}



async function UploadFile(input: {
    file: File,
    mediaType: string,
    slug: string,
    supabase: SupabaseClient<any, "public", "public", any, any>
    id: string
}) {
    const pathName = input.id + "/" + getPathName(input.slug, input.mediaType) + getFileExtension(input.file.name);
    return input.supabase.storage.from('draft-media').upload(pathName, input.file, {
        cacheControl: '3600',
        upsert: true
    });
}

export default function SubmitGamePage() {
    const router = useRouter()

    // ── text fields ──────────────────────────────────────────────
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [shortDesc, setShortDesc] = useState('')
    const [fullDesc, setFullDesc] = useState('')

    // ── file states ──────────────────────────────────────────────
    const [zipFile, setZipFile] = useState<File | null>(null)
    const [zipValid, setZipValid] = useState(false)
    const [iconFile, setIconFile] = useState<File | null>(null)
    const [iconPreview, setIconPreview] = useState('')
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState('')
    const [screenshots, setScreenshots] = useState<File[]>([])
    const [ssPreviews, setSsPreviews] = useState<string[]>([])
    const [trailerFile, setTrailerFile] = useState<File | null>(null)

    // ── UI states ────────────────────────────────────────────────
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [uploadPct, setUploadPct] = useState(0)

    const zipRef = useRef<HTMLInputElement>(null)
    const iconRef = useRef<HTMLInputElement>(null)
    const coverRef = useRef<HTMLInputElement>(null)
    const ssRef = useRef<HTMLInputElement>(null)
    const trailerRef = useRef<HTMLInputElement>(null)
    const { setLoading } = useLoading();
    const { showToast } = useToast();

    // ── helpers ──────────────────────────────────────────────────
    const mbOf = (f: File) => (f.size / 1024 / 1024).toFixed(1)
    const clearErr = (key: keyof FormErrors) =>
        setErrors(prev => { const n = { ...prev }; delete n[key]; return n })

    // ── ZIP handler ──────────────────────────────────────────────
    async function handleZipSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) {
            return;
        }
        clearErr('zip')
        setZipValid(false)
        setZipFile(null)

        if (!file.name.endsWith('.zip')) {
            setErrors(p => ({ ...p, zip: 'File must be a .zip file' }))
            return
        }
        if (file.size > MAX_ZIP_MB * 1024 * 1024) {
            setErrors(p => ({ ...p, zip: `ZIP must be under ${MAX_ZIP_MB} MB` }))
            return
        }
        // Check index.html at root using JSZip (dynamic import to avoid SSR issues)
        try {
            const JSZip = (await import('jszip')).default
            const zip = await JSZip.loadAsync(file)
            if (!zip.files['index.html']) {
                setErrors(p => ({
                    ...p,
                    zip: 'index.html must be at the root of the ZIP — not inside a subfolder'
                }))
                return
            }



        } catch {
            setErrors(p => ({ ...p, zip: 'Could not read ZIP. Make sure it is not corrupted.' }))
            return
        }
        setZipFile(file)
        setZipValid(true)
    }

    // ── icon handler ─────────────────────────────────────────────
    function handleIconSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        clearErr('icon')
        const allowed = ['image/png', 'image/jpeg', 'image/webp']
        if (!allowed.includes(file.type)) {
            setErrors(p => ({ ...p, icon: 'Icon must be PNG, JPG, or WebP' }))
            return
        }
        if (file.size > MAX_ICON_MB * 1024 * 1024) {
            setErrors(p => ({ ...p, icon: `Icon must be under ${MAX_ICON_MB} MB` }))
            return
        }
        setIconFile(file)
        setIconPreview(URL.createObjectURL(file))
    }

    // ── cover handler ────────────────────────────────────────────
    function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        clearErr('cover')
        const allowed = ['image/png', 'image/jpeg', 'image/webp']
        if (!allowed.includes(file.type)) {
            setErrors(p => ({ ...p, cover: 'Cover must be PNG, JPG, or WebP' }))
            return
        }
        if (file.size > MAX_COVER_MB * 1024 * 1024) {
            setErrors(p => ({ ...p, cover: `Cover must be under ${MAX_COVER_MB} MB` }))
            return
        }
        setCoverFile(file)
        setCoverPreview(URL.createObjectURL(file))
    }

    // ── screenshots handler ──────────────────────────────────────
    function handleSsSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        if (!files.length) return
        clearErr('screenshots')

        if (screenshots.length + files.length > MAX_SCREENSHOTS) {
            setErrors(p => ({ ...p, screenshots: `Maximum ${MAX_SCREENSHOTS} screenshots allowed` }))
            return
        }
        const allowed = ['image/png', 'image/jpeg', 'image/webp']
        for (const f of files) {
            if (!allowed.includes(f.type)) {
                setErrors(p => ({ ...p, screenshots: 'Screenshots must be PNG, JPG, or WebP' }))
                return
            }
            if (f.size > MAX_SS_MB * 1024 * 1024) {
                setErrors(p => ({ ...p, screenshots: `Each screenshot must be under ${MAX_SS_MB} MB` }))
                return
            }
        }
        setScreenshots(prev => [...prev, ...files])
        setSsPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    }

    function removeScreenshot(idx: number) {
        setScreenshots(prev => prev.filter((_, i) => i !== idx))
        setSsPreviews(prev => prev.filter((_, i) => i !== idx))
    }

    // ── trailer handler ──────────────────────────────────────────
    function handleTrailerSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        clearErr('trailer')
        if (file.type !== 'video/mp4') {
            setErrors(p => ({ ...p, trailer: 'Trailer must be an MP4 file' }))
            return
        }
        if (file.size > MAX_VID_MB * 1024 * 1024) {
            setErrors(p => ({ ...p, trailer: `Trailer must be under ${MAX_VID_MB} MB` }))
            return
        }
        setTrailerFile(file)
    }

    async function handleUploadFiles(slug: string) {
        let promises: Promise<void>[] = []
        const result = {
            cover_url: '',
            trailer_url: '',
        }
        const supabase = createSupabaseBrowser();
        const { data: user, error } = await supabase.auth.getUser();
        if (error || !user) {
            return result
        }

        if (coverFile) {
            promises.push(UploadFile({
                id: user.user.id,
                file: coverFile,
                mediaType: SUBMIT_FORM_TITLES.cover,
                supabase,
                slug
            }).then((resolve) => {
                const { data, error } = resolve;
                if (data) {
                    result.cover_url = data.fullPath;
                }
            }));
        }

        if (trailerFile) {
            promises.push(UploadFile({
                id: user.user.id,
                file: trailerFile,
                mediaType: SUBMIT_FORM_TITLES.trailer,
                supabase,
                slug
            }).then((resolve) => {
                const { data, error } = resolve;
                if (data) {
                    result.trailer_url = data.fullPath;
                }
            }));
        }

        // const form = new FormData()
        // form.append('title', title)
        // form.append('category', category)
        // form.append('short_desc', shortDesc)
        // form.append('full_desc', fullDesc)
        // form.append('build', zipFile!)
        // form.append('icon', iconFile!)
        // if (coverFile) form.append('cover', coverFile)
        // if (trailerFile) form.append('trailer', trailerFile)
        // screenshots.forEach(s => form.append('screenshots', s))
        // if (asDraft) form.appen('draft', 'true')

        // try {
        // Simulate upload progress
        // const progressInterval = setInterval(() => {
        //     setUploadPct(p => Math.min(p + 8, 90))
        // }, 400)

        // const res = await fetch('/api/games', { method: 'POST', body: form })
        // clearInterval(progressInterval)
        // setUploadPct(100)

        // const data = await res.json()
        // if (!res.ok) {
        //     setErrors({ zip: data.error || 'Submission failed. Please try again.' })
        //     setSubmitting(false)
        //     setUploadPct(0)
        //     return
        // }
        // router.push('/dashboard/dev/my-games')
        // } catch {
        //     setErrors({ zip: 'Network error. Please check your connection and try again.' })
        //     setSubmitting(false)
        //     setUploadPct(0)
        // }

        await Promise.all(promises);

        return result
    }

    const { uploadState, uploadFile } = useFileUpload();

    // ── submit ───────────────────────────────────────────────────
    async function handleSubmit(asDraft = false) {
        if (zipFile) {

            const { success, errorMsg } = await uploadFile(zipFile, '8-ball-pool');
            if (!success) {
                console.log("upload Error:", errorMsg);
            }

            // const { url } = await (await fetch('/api/uploads/presign', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         fileName: `772e3f99-2e7a-4e75-874c-cd4e097b84d3/8-ball-pool/${zipFile.name}`
            //     })
            // })).json();
            // console.log('url: ', url)
        }
        // setErrors({})
        // const errs: FormErrors = {
        // };
        // if (!coverFile) {
        //     errs.cover = "Cover is required"
        // }

        // if (!trailerFile) {
        //     errs.trailer = "Trailer video is required";
        // }

        // if (Object.keys(errs).length > 0) {
        //     setErrors(errs);
        //     return;
        // }
        // setLoading(true);
        // const gameInput = CreateGameInput({
        //     name: "8 ball pool",
        //     category: 'action',
        //     short_desc: "8ball pool",
        //     description: "8ball pool",
        //     status: asDraft ? 'draft' : 'pending-review'
        // })
        // const slug = getSlug(gameInput.name);

        // const {
        //     cover_url,
        //     trailer_url
        // } = await handleUploadFiles(slug);

        // if (cover_url) {
        //     gameInput.cover_url = cover_url
        // }

        // if (trailer_url) {
        //     gameInput.trailer_url = trailer_url
        // }

        // const formData = new FormData();
        // formData.append(SUBMIT_FORM_TITLES.game, JSON.stringify(gameInput));

        // const submitResponse = await fetch('/api/uploads', {
        //     method: "POST",
        //     body: formData
        // })
        // const { data, error }: {
        //     data: any,
        //     error: {
        //         message: string
        //     } | null
        // } = await submitResponse.json();

        // if (error) {
        //     showToast(error.message, 'error');
        // } else {
        //     showToast(`${asDraft ? 'Saved' : 'Submited'}`, 'success');
        // }

        // setLoading(false);
        // return;
        // // Client-side validation
        // const errs: FormErrors = {}
        // if (!title.trim()) errs.title = 'Title is required'
        // if (!category) errs.category = 'Category is required'
        // if (!shortDesc.trim()) errs.shortDesc = 'Short description is required'
        // if (!fullDesc.trim()) errs.fullDesc = 'Full description is required'
        // if (!zipFile) errs.zip = 'Game ZIP file is required'
        // if (!iconFile) errs.icon = 'Game icon is required'
        // if (Object.keys(errs).length) { setErrors(errs); return }


        // setSubmitting(true)

        // setUploadPct(10)

        // const gameInput = CreateGameInput({
        //     name: title,
        //     category: category,
        //     short_desc: shortDesc,
        //     description: fullDesc,
        //     status: asDraft ? 'draft' : 'pending-review'
        // })


        // const { } = await uploadFiles();

        // const submitResponse = await SubmitGameProfile(gameInput);
        // const { data, error } = await submitResponse.json();

        // if (error) {
        //     setErrors(error)
        // }

        // setSubmitting(false);
    }

    // ── render ───────────────────────────────────────────────────
    return (
        <div className={styles.page}>
            {/* ── page header ── */}
            <div className={styles.header}>
                <h1 className={styles.title}>Submit a Game</h1>
                <p className={styles.subtitle}>
                    Fill in the details and upload your game build. Your game will be reviewed by the GAMI team before going live.
                </p>
            </div>

            {/* ══ SECTION 1 — Game Info ══ */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNum}>1</span>
                    <span className={styles.sectionTitle}>Game Information</span>
                </div>
                <div className={styles.sectionBody}>
                    {/* Title */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Game Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                            placeholder="e.g. Space Blaster 3000"
                            value={title}
                            onChange={e => { setTitle(e.target.value); clearErr('title') }}
                            maxLength={80}
                        />
                        {errors.title && <p className={styles.errMsg}>{errors.title}</p>}
                    </div>

                    {/* Category + placeholder for version */}
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Category <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                                value={category}
                                onChange={e => { setCategory(e.target.value); clearErr('category') }}
                            >
                                <option value="">Select a category…</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className={styles.errMsg}>{errors.category}</p>}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Short Description <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={`${styles.input} ${errors.shortDesc ? styles.inputError : ''}`}
                                placeholder="One line shown in the game listing (max 120 chars)"
                                value={shortDesc}
                                onChange={e => { setShortDesc(e.target.value); clearErr('shortDesc') }}
                                maxLength={120}
                            />
                            {errors.shortDesc && <p className={styles.errMsg}>{errors.shortDesc}</p>}
                        </div>
                    </div>

                    {/* Full description */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Full Description <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            className={`${styles.textarea} ${errors.fullDesc ? styles.inputError : ''}`}
                            placeholder="Detailed description shown on the game detail page. Include controls, features, and how to play."
                            value={fullDesc}
                            onChange={e => { setFullDesc(e.target.value); clearErr('fullDesc') }}
                            rows={4}
                        />
                        {errors.fullDesc && <p className={styles.errMsg}>{errors.fullDesc}</p>}
                    </div>
                </div>
            </section>

            {/* ══ SECTION 2 — Game Build ZIP ══ */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNum}>2</span>
                    <span className={styles.sectionTitle}>Game Build (ZIP)</span>
                </div>
                <div className={styles.sectionBody}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Game ZIP File <span className={styles.required}>*</span>
                        </label>

                        {zipValid && zipFile ? (
                            /* ── valid state ── */
                            <div className={styles.zipValid}>
                                <span className={styles.zipValidIcon}>✅</span>
                                <span className={styles.zipFileName}>{zipFile.name}</span>
                                <span className={styles.zipMeta}>{mbOf(zipFile)} MB · index.html found at root ✓</span>
                                <button
                                    className={styles.zipRemove}
                                    onClick={() => { setZipFile(null); setZipValid(false); }}
                                    type="button"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            /* ── upload zone ── */
                            <div
                                className={`${styles.uploadZone} ${errors.zip ? styles.uploadZoneError : ''}`}
                                onClick={() => zipRef.current?.click()}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    e.preventDefault()
                                    const file = e.dataTransfer.files[0]
                                    console.log('zip')
                                    if (file) {
                                        const input = zipRef.current!
                                        const dt = new DataTransfer()
                                        dt.items.add(file)
                                        input.files = dt.files
                                        handleZipSelect({ target: input } as any)
                                    }
                                }}
                            >
                                <div className={styles.uploadIcon}>📦</div>
                                <div className={styles.uploadLabel}>Drop your game ZIP here or click to browse</div>
                                <div className={styles.uploadHint}>Max 50 MB · index.html must be at root of ZIP</div>
                            </div>
                        )}
                        <input key={zipFile ? zipFile.name : ''} ref={zipRef} type="file" accept=".zip" className="hidden" onChange={(e) => {
                            handleZipSelect(e);
                        }} />
                        {errors.zip && <p className={styles.errMsg}>{errors.zip}</p>}
                    </div>

                    <div className={styles.zipRequirements}>
                        <strong>ZIP structure required:</strong>
                        <code className={styles.codeBlock}>

                            {`mygame.zip\n  index.html  ← must be here at root\n  game.js\n  assets/`}
                        </code>
                    </div>
                </div>
            </section>

            {/* ══ SECTION 3 — Icon + Cover ══ */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNum}>3</span>
                    <span className={styles.sectionTitle}>Icon &amp; Cover Image</span>
                </div>
                <div className={styles.sectionBody}>
                    <div className={styles.assetPair}>
                        {/* Icon */}
                        <div className={styles.iconCol}>
                            <label className={styles.label}>
                                Game Icon <span className={styles.required}>*</span>
                            </label>
                            <div
                                className={`${styles.iconBox} ${errors.icon ? styles.iconBoxError : ''}`}
                                onClick={() => iconRef.current?.click()}
                                title="Click to upload icon"
                            >
                                {iconPreview
                                    ? <img src={iconPreview} alt="Icon preview" className={styles.iconImg} />
                                    : <span className={styles.iconPlaceholder}>🎮</span>
                                }
                            </div>
                            <p className={styles.assetHint}>512×512 · PNG/JPG/WebP · 2 MB max</p>
                            <input ref={iconRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleIconSelect} />
                            {errors.icon && <p className={styles.errMsg}>{errors.icon}</p>}
                        </div>

                        {/* Cover */}
                        <div className={styles.coverCol}>
                            <label className={styles.label}>
                                Cover Image <span className={styles.optional}>(recommended — shown as hero on game page)</span>
                            </label>
                            <div
                                className={`${styles.coverBox} ${errors.cover ? styles.coverBoxError : ''}`}
                                onClick={() => coverRef.current?.click()}
                                title="Click to upload cover"
                            >
                                {coverPreview
                                    ? <img src={coverPreview} alt="Cover preview" className={styles.coverImg} />
                                    : (
                                        <div className={styles.coverPlaceholder}>
                                            <span className={styles.coverPlaceholderIcon}>🖼️</span>
                                            <span className={styles.coverPlaceholderText}>Click to upload cover image</span>
                                            <span className={styles.coverPlaceholderHint}>1280×720 · PNG/JPG/WebP · 5 MB max</span>
                                        </div>
                                    )
                                }
                            </div>
                            <input ref={coverRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleCoverSelect} />
                            {errors.cover && <p className={styles.errMsg}>{errors.cover}</p>}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ SECTION 4 — Screenshots ══ */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNum}>4</span>
                    <span className={styles.sectionTitle}>Screenshots</span>
                    <span className={styles.sectionOptional}>{screenshots.length} / {MAX_SCREENSHOTS} uploaded</span>
                </div>
                <div className={styles.sectionBody}>
                    <label className={styles.label}>
                        Screenshots
                        <span className={styles.optional}> (up to 5 · PNG/JPG/WebP · 3 MB each · 1280×720 recommended)</span>
                    </label>
                    <div className={styles.ssStrip}>
                        {ssPreviews.map((src, i) => (
                            <div key={i} className={styles.ssThumb}>
                                <img src={src} alt={`Screenshot ${i + 1}`} className={styles.ssThumbImg} />
                                <button
                                    className={styles.ssRemove}
                                    onClick={() => removeScreenshot(i)}
                                    type="button"
                                    title="Remove"
                                >✕</button>
                            </div>
                        ))}
                        {screenshots.length < MAX_SCREENSHOTS && (
                            <div
                                className={styles.ssAdd}
                                onClick={() => ssRef.current?.click()}
                                title="Add screenshot"
                            >+</div>
                        )}
                    </div>
                    <input
                        ref={ssRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleSsSelect}
                    />
                    {errors.screenshots && <p className={styles.errMsg}>{errors.screenshots}</p>}
                </div>
            </section>

            {/* ══ SECTION 5 — Trailer ══ */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNum}>5</span>
                    <span className={styles.sectionTitle}>Trailer Video</span>
                    <span className={styles.sectionOptional}>optional</span>
                </div>
                <div className={styles.sectionBody}>
                    <label className={styles.label}>
                        Gameplay Trailer
                        <span className={styles.optional}> (MP4 only · max 100 MB · uploaded to Cloudflare Stream)</span>
                    </label>

                    {trailerFile ? (
                        <div className={styles.trailerRow}>
                            <span className={styles.trailerIcon}>🎬</span>
                            <div className={styles.trailerInfo}>
                                <div className={styles.trailerName}>{trailerFile.name}</div>
                                <div className={styles.trailerMeta}>{mbOf(trailerFile)} MB · MP4</div>
                            </div>
                            <button
                                className={styles.trailerRemove}
                                onClick={() => { setTrailerFile(null); clearErr('trailer') }}
                                type="button"
                                title="Remove"
                            >✕</button>
                        </div>
                    ) : (
                        <div
                            className={styles.uploadZone}
                            onClick={() => trailerRef.current?.click()}
                        >
                            <div className={styles.uploadIcon}>🎬</div>
                            <div className={styles.uploadLabel}>Click to upload gameplay trailer</div>
                            <div className={styles.uploadHint}>MP4 only · max 100 MB · Cloudflare Stream handles transcoding</div>
                        </div>
                    )}
                    <input ref={trailerRef} type="file" accept="video/mp4" className="hidden" onChange={handleTrailerSelect} />
                    {errors.trailer && <p className={styles.errMsg}>{errors.trailer}</p>}
                </div>
            </section>

            {/* ══ SUBMIT BAR ══ */}
            <div className={styles.submitBar}>
                {submitting && (
                    <div className={styles.progressWrap}>
                        <div className={styles.progressBar} style={{ width: `${uploadPct}%` }} />
                    </div>
                )}
                <div className={styles.submitInner}>
                    <p className={styles.submitNote}>
                        {submitting
                            ? `Uploading… ${uploadPct}%`
                            : 'Game will be submitted for review. Status starts as Pending Review.'
                        }
                    </p>
                    <div className={styles.submitBtns}>
                        <button
                            type="button"
                            className={styles.btnSecondary}
                            onClick={() => handleSubmit(true)}
                            disabled={submitting}
                        >
                            Save Draft
                        </button>
                        <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting…' : 'Submit for Review →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
