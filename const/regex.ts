export const REGEX = {

    // ── Auth ───────────────────────────────────────────────────
    // Standard email format: local@domain.tld
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
    passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/,
    // At least 8 chars, 1 letter, 1 number (relaxed)
    passwordModerate: /^(?=.*[a-zA-Z])(?=.*\d).{8,72}$/,
    // 3–30 chars, letters/numbers/underscore/hyphen, no leading/trailing special
    username: /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,28}[a-zA-Z0-9]$|^[a-zA-Z0-9]{3}$/,
    // ── Names ──────────────────────────────────────────────────
    // Display name: letters, spaces, dots, hyphens, apostrophes (2–50 chars)
    displayName: /^[a-zA-Z\u00C0-\u024F' .\-]{2,50}$/,
    // ── Game content ───────────────────────────────────────────
    // URL slug: lowercase letters, numbers, hyphens only — no leading/trailing hyphen
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    // Game title: letters, numbers, spaces, common punctuation (1–100 chars)
    gameTitle: /^[\w\s\-'":!&.,()]{1,100}$/,
    // Short description / tagline (1–160 chars, any char except < > for XSS)
    tagline: /^[^<>]{1,160}$/,
    // ── URLs ───────────────────────────────────────────────────
    // Generic http/https URL
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/,
    // https only (no http)
    urlHttps: /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/,
    // YouTube video URL (standard + short)
    youtubeUrl: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(&\S*)?$/,

    // ── Files ──────────────────────────────────────────────────

    // Image file extensions
    imageFile: /\.(jpg|jpeg|png|gif|webp|svg)$/i,

    // Video file extensions
    videoFile: /\.(mp4|webm|ogg|mov|avi)$/i,

    // Audio file extensions
    audioFile: /\.(mp3|ogg|wav|flac|aac)$/i,

    // Web game file extensions (html, js, css, wasm, etc.)
    gameFile: /\.(html|htm|js|mjs|css|json|wasm|png|jpg|jpeg|gif|webp|svg|mp3|ogg|wav|mp4|webm|woff|woff2|ttf|xml|txt)$/i,

    // ── Numbers & IDs ──────────────────────────────────────────

    // UUID v4
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    // Positive integer (no leading zeros)
    positiveInt: /^[1-9]\d*$/,

    // Version number: 1 / 1.2 / 1.2.3
    version: /^\d+(\.\d+){0,2}$/,

    // Hex color: #fff or #ffffff
    hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,

    // ── Security ───────────────────────────────────────────────

    // Detect common XSS patterns (script tags, event handlers)
    xss: /<script[\s\S]*?>[\s\S]*?<\/script>|on\w+\s*=|javascript:/i,

    // Detect SQL injection keywords
    sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)|('|--|;|\/\*|\*\/)/i,

    // No HTML tags at all
    noHtml: /^[^<>]*$/,

    // Whitespace only (empty after trim check)
    whitespaceOnly: /^\s*$/,
}