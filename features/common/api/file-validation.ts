const ALLOWED_MIME_TYPES: Record<string, string[]> = {
    "application/pdf": ["pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
    "image/png": ["png"],
    "image/jpeg": ["jpg", "jpeg"],
};

const MAGIC_BYTES: Record<string, number[]> = {
    pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
    png: [0x89, 0x50, 0x4e, 0x47], // PNG header
    jpg: [0xff, 0xd8, 0xff], // JPEG header
    docx: [0x50, 0x4b, 0x03, 0x04], // ZIP/DOCX header
};

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export function validateFileType(file: File): FileValidationResult {
    const allowedExtensions = Object.values(ALLOWED_MIME_TYPES).flat();
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`,
        };
    }

    const allowedMimes = Object.keys(ALLOWED_MIME_TYPES);
    if (!allowedMimes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid MIME type: ${file.type}`,
        };
    }

    return { valid: true };
}

export function validateFileSize(file: File): FileValidationResult {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${MAX_FILE_SIZE_MB}MB`,
        };
    }

    if (file.size === 0) {
        return {
            valid: false,
            error: "File is empty",
        };
    }

    return { valid: true };
}

export async function validateFileMagicBytes(file: File): Promise<FileValidationResult> {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) {
        return { valid: false, error: "Missing file extension" };
    }

    const expectedBytes = MAGIC_BYTES[extension];
    if (!expectedBytes) {
        return { valid: true };
    }

    const buffer = await file.slice(0, expectedBytes.length).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < expectedBytes.length; i++) {
        if (bytes[i] !== expectedBytes[i]) {
            return {
                valid: false,
                error: "File content does not match its extension",
            };
        }
    }

    return { valid: true };
}

export async function validateFile(file: File): Promise<FileValidationResult> {
    const typeResult = validateFileType(file);
    if (!typeResult.valid) return typeResult;

    const sizeResult = validateFileSize(file);
    if (!sizeResult.valid) return sizeResult;

    const magicResult = await validateFileMagicBytes(file);
    if (!magicResult.valid) return magicResult;

    return { valid: true };
}

export async function validateFiles(files: File[]): Promise<FileValidationResult> {
    for (const file of files) {
        const result = await validateFile(file);
        if (!result.valid) {
            return {
                valid: false,
                error: `${file.name}: ${result.error}`,
            };
        }
    }
    return { valid: true };
}
