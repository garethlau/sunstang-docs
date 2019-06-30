import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import PopupBanner from './PopupBanner';
import fileDownload from 'js-file-download';

const FileDropZone = (props) => {
    console.log("PROPS IN FILEDROPZONE")
    console.log(props);
    const {pageId, filenames} = props;
    if (pageId != null) {
        // we're editting an aready existing page
        
    }
    else {
        // this is a new page so we have no id
        // show an error message saying you have to have a saved page first
    }

    const [doneUpload, setDoneUpload] = useState(false);
    const [myFiles, setMyFiles] = useState([]);

    console.log("myfiles", myFiles);

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
            const result = await Promise.all(promises);
            // create an array with all the files associated with the page
            let filenamesToLink = result.map(file => {
                return {
                    filename: file.data.file.filename,
                    originalname: file.data.file.originalname,
                };
            });

            filenames.forEach(filename => {
                filenamesToLink.push(filename);
            });
            // now link the filenames to the page
            const path = '/api/pages/link/' + pageId;
            console.log("calling: " + path)
            axios.post(path, {
                data: filenamesToLink
            }).then((res) => {
                console.log("res in link");
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
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
            axios.post('/api/files/', data, config).then(res => {
                const newFiles = [...myFiles];
                newFiles.splice(0, 1) 
                setMyFiles(newFiles)    // remove the item after its uploaded
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

    const renderFilenamesList = () => {
        // return a link, when they click the link it should fetch the file
        return filenames.map(filename => {
            return (
                <li>
                    <button onClick={() => downloadFile(filename)}>{filename.originalname}</button>
                </li>
            )
        })
    }

    const downloadFile = (filename) => {
        let path = '/api/files/' + filename.filename; 
        axios({
            method: "GET",
            url: path,
            responseType: "blob"
        }).then(response => {
            fileDownload(response.data, filename.originalname);
        }).catch(err => {console.log(err)})
    }

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
                <ul>
                    {renderFilenamesList()}
                </ul>
            </section>
        </>
    )
}
export default FileDropZone;