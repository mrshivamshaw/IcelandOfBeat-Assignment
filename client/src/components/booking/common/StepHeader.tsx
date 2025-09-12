const StepHeader = ({ textString }: { textString: string }) => {
    return (
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{textString}</h2>
        </div>
    )
}

export default StepHeader