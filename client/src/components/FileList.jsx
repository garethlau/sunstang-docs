import React from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';

import fileListStyles from '../styles/fileListStyles.module.css';

const FileZone = (props) => {
    let {files} = props;

    const renderFilenamesList = () => {
        console.log("files is:" , files);
        if (files === undefined || files.length === 0) {
            return (
                <p>This page has no files.</p>
            )
        }
        else {
            return files.map(filename => {
                return (
                    <div style={{}}>
                        <button onClick={() => downloadFile(filename)} className={fileListStyles.fileBtn}>
                            <div className={fileListStyles.fileBtnName}>
                                {filename.originalname}
                            </div>
                            <div className={fileListStyles.fileBtnIcon}>
                                <i class="material-icons">
                                    cloud_download
                                </i>
                            </div>
                        </button>
                    </div>
                )
            })
        }

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

    return (
        <div className={fileListStyles.fileListContainer}>
            <h1 >Files</h1>
            <div style={{height: "100%"}}>
                {renderFilenamesList()}
            </div>
        </div>
    )
}
export default FileZone;