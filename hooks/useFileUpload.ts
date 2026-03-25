import { useCallback, useState } from "react";


interface UploadProgress {
    loaded: number,
    total: number,
    percentage: number
}

interface UploadState {
    isUploading: boolean;
    progress: UploadProgress | null;
    result: string,
    error: string
}

const publicURL = "https://pub-8ab6d2276b1d465fb3ded4e5bbbcb7d3.r2.dev"

export const useFileUpload = () => {
    const [uploadState, SetUpdateState] = useState<UploadState>({
        isUploading: false,
        progress: null,
        result: '',
        error: '',
    });
    const uploadFile = useCallback(async (
        file: File,
        gameId: string,
    ) => {
        try {
            SetUpdateState({
                isUploading: true,
                progress: null,
                result: '',
                error: '',
            })
            const fileName = `${gameId}/${file.name}`;
            const { url: presignURL } = await (await fetch('/api/uploads/presign', {
                method: 'POST',
                body: JSON.stringify({
                    fileName
                })
            })).json();

            await uploadToR2(file, presignURL, (progress) => {
                SetUpdateState(prev => ({
                    ...prev,
                    progress
                }))
            })
            SetUpdateState({
                isUploading: false,
                progress: null,
                result: `${publicURL}/${fileName}`,
                error: '',
            })
            return {
                success: true,
                errorMsg: ''
            }

        } catch (error) {
            console.log(error);
            const errorMsg = error instanceof Error ? error.message : 'Upload failed';
            SetUpdateState({
                isUploading: false,
                progress: null,
                result: '',
                error: errorMsg,
            })

            return {
                success: false,
                errorMsg: errorMsg
            }
        }
    }, [])


    return {
        uploadState,
        uploadFile
    }
}

async function uploadToR2(file: File, presignURL: string, onProgress: (progress: UploadProgress) => void): Promise<void> {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
                onProgress({
                    loaded: evt.loaded,
                    total: evt.total,
                    percentage: Math.round(evt.loaded / evt.total) * 100
                })

            }
        })

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
        })

        xhr.addEventListener('error', (evt) => {
            reject(new Error('Upload failed s'));
        });

        xhr.open('PUT', presignURL, true);
        xhr.setRequestHeader('Content-Type', "application/zip")
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.send(file);
    })
}