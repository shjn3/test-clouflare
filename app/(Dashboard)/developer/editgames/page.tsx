'use client'
import { useState } from "react";


export default () => {
    // const { categories, updateGame, draftGame, myGames } = useGlobal()
    // const { navigateTo } = useApp();
    // const { user } = useAuth();
    // const { showToast } = useToast();
    // const [internalDraftGame, setInternalDraftGame] = useState<GamiGame>(TEMPLATE)
    // useEffect(() => {
    //     if (draftGame) {
    //         setInternalDraftGame({
    //             ...draftGame
    //         })
    //     }
    //     setCover11(undefined);
    //     setCover23(undefined);
    //     setCover169(undefined);
    //     setVideo(undefined);
    // }, [draftGame])

    const [cover11, setCover11] = useState<File>();
    const [cover23, setCover23] = useState<File>();
    const [cover169, setCover169] = useState<File>();
    const [video, setVideo] = useState<File>();
    const [gameFolder, setGameFolder] = useState<FileList>();

    function handleBuildFile(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        if (!e.currentTarget || !e.currentTarget.files || !e.currentTarget.files[0]) return;

        setGameFolder(e.currentTarget.files);
    }

    function handleBuildDrop() {

    }

    function handleAsset(a1: string, a2: string) {


    }

    // function getGameFormData(): GamiGame {
    //     return {
    //         ...internalDraftGame,
    //         developer: user ? user.studio_name : '',
    //         developer_id: user ? user.local_id : '',
    //     }
    // }

    // async function doUpdateGame() {
    //     let s: boolean = await updateGame(getGameFormData(), {
    //         cover11,
    //         cover23,
    //         cover169,
    //         video,
    //         game: gameFolder
    //     });
    //     if (s) {
    //         showToast("Update successfully!", "success");
    //     } else {
    //         showToast("Update failed!", "error");
    //     }
    // }

    // function onInputChanged(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement> | React.ChangeEvent<HTMLSelectElement, HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) {
    //     setInternalDraftGame({
    //         ...internalDraftGame,
    //         [`${e.target.name}`]: e.target.value
    //     })
    // }

    // function hanldeBuildCover(cover: File, type: CoverType) {
    //     if (type == '1x1') {
    //         setCover11(cover);
    //     } else if (type == '2x3') {
    //         setCover23(cover);
    //     } else if (type == '16x9') {
    //         setCover169(cover);
    //     }
    // }

    function handleBuildVideo(video: File) {
        setVideo(video);
    }


    return <div className="section" id="sec-submit">
        <div className="page-title">Edit game</div>
        <div className="page-sub">Fill in your game details and upload assets. We review within 48 hours.</div>

        <div className="content-card">
            <div className="card-title">📦 Game Build</div>
            <div className="upload-zone" id="buildZone" onClick={
                () => document.getElementById('buildInput')?.click()
            }
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag') }} onDragLeave={(e) => e.currentTarget.classList.remove('drag')}
                onDrop={handleBuildDrop}>
                <div className="upload-icon" id="buildIcon">{gameFolder ? '✅' : '📦'}</div>
                <div className="upload-text" id="buildText">
                    {
                        gameFolder ? <span className="upload-success">Rready to submit</span>
                            : 'Drop your game ZIP here or click to browse'
                    }
                </div>
                <div className="upload-hint">HTML5 only • up to 50 MB • index.html must be at root</div>
                <input type="file" id="buildInput" multiple
                    // @ts-ignore
                    webkitdirectory="true" style={{ display: 'none' }} onChange={(e) => {
                        handleBuildFile(e)
                    }} />
            </div>
        </div>

        <div className="content-card">
            <div className="card-title">🖼️ Assets</div>
            <div className="asset-row">
                {/* <SlotCover coverType='1x1' setFile={hanldeBuildCover} url={getCover11URl(internalDraftGame?.covers, '')} />
                <SlotCover coverType='2x3' setFile={hanldeBuildCover} url={getCover23URl(internalDraftGame?.covers, '')} />
                <SlotCover coverType='16x9' setFile={hanldeBuildCover} url={getCover169URl(internalDraftGame?.covers, '')} />
                <VideoSlot setFile={handleBuildVideo} url={internalDraftGame.videos?.sizes[0].location ?? ''} /> */}

            </div>
        </div>

        <div className="content-card">
            <div className="card-title">📋 Game Details</div>
            <div className="form-grid">
                <div className="fg">
                    <label className="flabel">Game Title *</label>
                    {/* <input className="finput" id="subTitle" placeholder="e.g. Neon Blaster Pro"
                        name="name"
                        value={internalDraftGame.name} onChange={(e) => onInputChanged(e)}
                    /> */}
                </div>
                <div className="fg">
                    <label className="flabel">Category *</label>
                    {/* <select className="finput" id="subCat"
                        value={internalDraftGame.category}
                        name="category"
                        onChange={(e) => onInputChanged(e)}>
                        <option value="">Select category…</option>
                        {
                            categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                        }
                    </select> */}
                </div>

                {/* <div className="fg full">
                    <label className="flabel">Short Description * <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(shown on
                        game card, max 120 chars)</span></label>
                    <input className="finput" id="subShortDesc" placeholder="One-line hook for your game" maxLength={120} />
                </div> */}

                <div className="fg full">
                    <label className="flabel">Full Description *</label>
                    {/* <textarea className="finput" id="subFullDesc"
                        placeholder="Describe gameplay, features, controls…"
                        value={internalDraftGame.description}
                        name="description"
                        onChange={(e) => onInputChanged(e)}
                    ></textarea> */}
                </div>
                <div className="fg">
                    <label className="flabel">Tags <span
                        style={{ color: 'var(--muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                    {/* <input className="finput" id="subTags" placeholder="neon, space, arcade"
                        value={internalDraftGame.tag}
                        name="tag"
                        onChange={(e) => onInputChanged(e)}
                    /> */}
                </div>
                <div className="fg">
                    <label className="flabel">Age Rating</label>
                    <select className="finput" id="subAge">
                        <option>All Ages</option>
                        <option>7+</option>
                        <option>12+</option>
                        <option>16+</option>
                    </select>
                </div>
                <div className="fg">
                    <label className="flabel">Controls</label>
                    <input className="finput" id="subControls" placeholder="e.g. Arrow Keys, WASD, Touch" />
                </div>
                <div className="fg">
                    <label className="flabel">Game URL <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(if already
                        hosted)</span></label>
                    {/* <input className="finput" id="subUrl" placeholder="https://your-game.com" name="external_url" value={internalDraftGame.external_url} onChange={(e) => onInputChanged(e)} /> */}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {/* <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }} onClick={doUpdateGame}>Update</button> */}
                {/* <button className="btn btn-secondary" onClick={doSaveraft}>Save Draft</button> */}
            </div>
        </div>
    </div>

}