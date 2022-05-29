const LabelMod = (props) => {
    return (
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-sky-600 bg-sky-200 uppercase last:mr-0 mr-1">
            {props.name}
        </span>
    )
}

export default LabelMod;