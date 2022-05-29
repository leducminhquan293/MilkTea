const InputMod = (props) => {

    return (
        <div className="mb-3 pt-0">
            <input type="text" placeholder={props.placeholder} className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
        </div>
    )
}

export default InputMod;