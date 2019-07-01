import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import PopupBanner from './PopupBanner';
import fileDownload from 'js-file-download';

import fileDropZoneStyles from '../styles/fileDropZoneStyles.module.css';

const FileDropZone = (props) => {
    console.log("PROPS IN FILEDROPZONE")
    console.log(props);
    
    const [doneUpload, setDoneUpload] = useState(false);
    const [myFiles, setMyFiles] = useState([]);
    const [filenames, setFilenames] = useState(props.filenames)
    const {pageId} = props;

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
            axios.post(path, {
                data: filenamesToLink
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
            setDoneUpload(true);
            setMyFiles([]); // redundent clearing of files
            setFilenames(filenamesToLink);  // rerender the file names to display
            setTimeout(() => {
                setDoneUpload(false);
            }, 3000);
        }
        catch(err) {
            console.log(err);
        }
    }

    const sendRequest = (file) => {
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
        <div key={file.path} className={fileDropZoneStyles.fileContainer}> 
            <div className={fileDropZoneStyles.filename}>
                {file.path} - {file.size} bytes{" "}
            </div>
            <div className={fileDropZoneStyles.btnContainer}>
                <button onClick={removeFile(file)} className={fileDropZoneStyles.deleteBtn}>
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </div>
        </div>
    ))

    const unlinkFile = (filenameObj) => {
        // console.log("=== UNLINKING FILE === > ", filenameObj);
        const path = '/api/pages/unlink/' + pageId + "?filename=" + filenameObj.filename;
        axios.post(path).then((res) => {
            setFilenames(res.data.files);
        });
    }

    const renderFilenamesList = () => {
        // return a link, when they click the link it should fetch the file
        return filenames.map(filename => {
            return (
                <div className={fileDropZoneStyles.fileContainer}>
                    <div className={fileDropZoneStyles.filename}>
                        {filename.originalname}
                    </div>
                    <div className={fileDropZoneStyles.btnContainer}>
                        <button onClick={() => downloadFile(filename)} className={fileDropZoneStyles.downloadBtn}>
                            <i class="material-icons">
                                cloud_download
                            </i>
                        </button>
                        <button onClick={() => unlinkFile(filename)} className={fileDropZoneStyles.deleteBtn}>
                            <i class="material-icons">
                                delete
                            </i>
                        </button>
                    </div>

                </div>
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
            <div className={`${fileDropZoneStyles.container}`}>
                <h1>Upload Files</h1>
                <div {...getRootProps({ className: "dropzone" })}>
                    <div className={fileDropZoneStyles.dropZone}>
                        <input {...getInputProps()} />
                        <p>Drop files here, or click to select files</p>
                    </div>
                </div>
                <aside>
                    {files.length > 0 && <h3 style={{marginBottom: "0"}}>Files: </h3>}
                    <div>{files}</div>
                </aside>
                {
                    files.length > 0 &&
                    <button  onClick={uploadFiles} className={fileDropZoneStyles.actionBtn}>
                        <div className={fileDropZoneStyles.buttonText}>
                            Upload
                        </div>
                        <i class="material-icons" style={{padding: "5px 10px 0px 5px"}}>
                            cloud_upload
                        </i>
                    </button>
                }
                {
                    files.length > 0 && 
                    <button onClick={removeAll} className={fileDropZoneStyles.actionBtn}>
                        <div className={fileDropZoneStyles.buttonText}>
                            Remove All    
                        </div> 
                        <i class="material-icons" style={{padding: "5px 10px 0px 5px"}}>
                            delete
                        </i>
                    </button>
                }
                <div className={fileDropZoneStyles.filesContainer}>
                    <h1>Attached Files</h1>
                    {renderFilenamesList()}
                </div>
            </div>
        </>
    )


}
export default FileDropZone;