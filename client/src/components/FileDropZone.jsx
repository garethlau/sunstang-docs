import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import PopupBanner from './PopupBanner';

const FileDropZone = (props) => {
    const [doneUpload, setDoneUpload] = useState(false);
    const [myFiles, setMyFiles] = useState([])

    const onDrop = useCallback(acceptedFiles => {
        setMyFiles([...myFiles, ...acceptedFiles])
    })

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    })

    const removeFile = file => () => {
        const newFiles = [...myFiles]
        newFiles.splice(newFiles.indexOf(file), 1)
        setMyFiles(newFiles)
    }

    const removeAll = () => {
        setMyFiles([])
    }

    const uploadFiles = async () => {
        setDoneUpload(false);
        let promises = [];
        myFiles.forEach(file => {
            promises.push(sendRequest(file));
        });
        try {
            await Promise.all(promises);
            console.log("Done uploading");
            setDoneUpload(true);
            setMyFiles([]);
            setTimeout(() => {
                setDoneUpload(false);
            }, 3000);
        }
        catch(err) {
            console.log(err);
        }
    }

    const sendRequest = (file) => {
        console.log("sendRequest", file);
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('File', file);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            axios.post('/api/file/upload', data, config).then(res => {
                const newFiles = [...myFiles];
                newFiles.splice(0, 1) 
                setMyFiles(newFiles)    // remove the first item
                resolve(res);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    const files = myFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes{" "}
            <button onClick={removeFile(file)}>Remove File</button>
        </li>
    ))

    const renderPopup = () => {
        console.log("Doneupload is", doneUpload);
        if (doneUpload !== false) {
            return (<PopupBanner status={'success'} message={'Successfully uploaded'}/>)
        }
    }

    return (
        <>
            {renderPopup()}
            <section className="">
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
                {files.length > 0 && <button onClick={removeAll}>Remove All</button>}
                <input type="submit" value="upload" onClick={uploadFiles}/>
            </section>
        </>
    )
}
export default FileDropZone;