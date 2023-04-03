import React, { useContext, useState } from "react"
import { BACKEND_AJAX_URL, SLUG } from "../../../../common/store";
import { CreateNftContext } from "./state";
const {__} = wp.i18n

export const UnlockableFileUploads = () => {
    const { state, dispatch } = useContext(CreateNftContext);

    const [unlockableActive, setUnlockableActive] = useState(false);
    const onActiveOrDeactive = (e) => {
        setUnlockableActive(!unlockableActive);
    };

    const [uploadingFile, setUploadingFile] = useState({loading: false})
    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
    const processUpload = async (e) => {
        const file = e.target.files[0];
        const fileName = file.name;
        const fileSize = file.size;
        const fileType = file.type;
        setUploadingFile({
            loading: true,
            name: fileName,
            size: formatBytes(fileSize),
            type: fileType,
            date: new Date()             
        })
        const formData = new FormData()
        formData.append("action", "unlockable_upload");
        formData.append("file_name", fileName);
        formData.append("upload_file", file);
        const res = await jQuery.ajax({
            type: "post",
            url: BACKEND_AJAX_URL,
            data: formData,
            processData: false,
            contentType: false,
        });
        
        const newFiles = [...state.unlockableFiles, {
            name: res.filename,
            size: res.filesize,
            type: fileType,
            url: res.url,
            id: res.id,
            time: res.time,
        }]

        await dispatch({ type: "CHANGE_UNLOCKABLE_FILES", payload: newFiles });

        await setUploadingFile({loading: false})
    }
    const deleteFile = (fileid) =>{
        const temp = state.unlockableFiles
        const index = temp.findIndex( elem => elem.id == fileid )
        temp.splice(index, 1);
        console.log('temp---', temp)
        console.log('index---', index)

        dispatch({ type: "CHANGE_UNLOCKABLE_FILES", payload: [...temp] });
    }
    return(
        <div>
            <div className="create-nft-form__switcher-section">
                <p className="header-two">{__("Unlockable Content", SLUG)}</p>
                <label className="switch">
                <input type="checkbox" onChange={onActiveOrDeactive} />
                <span className="slider round"></span>
                </label>
                <p className="pra-one ">
                {__("Add your unlockable files here. Make sure to compress your files for better delivery.", SLUG)}
                </p>
            </div>

            {unlockableActive ? (
                <div style={{marginBottom: 30}}>
                    <label htmlFor="unlockable-upload" className="unlockable-upload">
                        Choose a file
                        <input onChange={ e => processUpload(e)} type="file" id="unlockable-upload" />
                    </label>
                    <div className="upload-lists">
                        {                    
                            uploadingFile.loading &&
                            <div className="upload-single">
                                <p className="file-name">{uploadingFile.name}</p>
                                <span className="file-meta">Uploading... {uploadingFile.size}</span>
                            </div>
                        }
                        { 
                            state.unlockableFiles.length > 0 &&
                            state.unlockableFiles.map( (elem, i) => (
                                <div className="upload-single" key={i}>
                                    <p className="file-name">{elem.name}</p>
                                    <span className="file-meta">{elem.type} - {elem.time} - {formatBytes(elem.size)}</span>
                                    <span className="delete-file" onClick={ e => deleteFile(elem.id)}>Delete</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ) : null}
        </div>
        
    )
}