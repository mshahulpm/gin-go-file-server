const {
    useState,
    useEffect
} = React

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <App />
)

function App() {

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progressB, setProgressB] = useState({ p: 0, time: null })
    const [progressM, setProgressM] = useState({ p: 0, time: null })


    function handleBase64() {
        if (!file || loading) return alert("Please select a file")
        let start = Date.now()
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {

            const data = {
                file: reader.result,
                ext: file.name.split(".").pop()
            }

            const dataSize = getSizeInBytes(data)


            axios.post('/base64', data, {
                headers: {
                    "Content-Type": "application/json"
                },
                onUploadProgress: ev => {
                    setProgressB(prev => ({
                        ...prev,
                        p: ((ev.loaded / dataSize) * 100).toFixed()
                    }))
                }
            })
                .then(() => { })
                .catch(console.log)
                .finally(() => {
                    setProgressB(prev => ({
                        ...prev,
                        time: "Total Time taken : " + ((Date.now() - start) / 1000).toFixed(2) + " seconds"
                    }))
                })
        }
        reader.onerror = e => console.error(e)
    }

    function handleMulti() {
        if (!file || loading) return alert("Please select a file")
        let start = Date.now()
        const data = new FormData()
        data.append("file", file)
        axios.post('/upload', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: ev => {
                setProgressM(prev => ({
                    ...prev,
                    p: ((ev.loaded / file.size) * 100).toFixed()
                }))
            }
        })
            .then(() => { })
            .catch(console.log)
            .finally(() => {
                setProgressM(prev => ({
                    ...prev,
                    time: "Total Time taken : " + ((Date.now() - start) / 1000).toFixed(2) + " seconds"
                }))
            })
    }

    function onFileChange(e) {
        const file = e.target.files[0]
        setFile(file)
    }

    return (
        <div>
            <h3>Go File server</h3>
            <div>
                <p>Base64</p>
                <p>{progressB.p} %</p>
                <p>{progressB.time}</p>

                <p>Multi</p>
                <p>{progressM.p} %</p>
                <p>{progressM.time}</p>
            </div>
            <input onChange={onFileChange} type="file" id="file" />
            <button onClick={handleBase64} id="base-64">save as base64</button>
            <button onClick={handleMulti} id="multi">save as multipart</button>
        </div>
    )
}


const getSizeInBytes = obj => {
    let str = null;
    if (typeof obj === 'string') {
        // If obj is a string, then use it
        str = obj;
    } else {
        // Else, make obj into a string
        str = JSON.stringify(obj);
    }
    // Get the length of the Uint8Array
    const bytes = new TextEncoder().encode(str).length;
    return bytes;
};
