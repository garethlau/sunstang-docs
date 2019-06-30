import React from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download';

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
                    <li>
                        <button onClick={() => downloadFile(filename)}>{filename.originalname}</button>
                    </li>
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
        <div style={{backgroundColor: "red", padding: "0 2.5% 0 2.5%"}}>
            <h1>Files</h1>
            <ul>
                {renderFilenamesList()}
            </ul>
        </div>
    )
}
export default FileZone;