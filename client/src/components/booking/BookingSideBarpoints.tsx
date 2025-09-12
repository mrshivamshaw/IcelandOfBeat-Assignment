const BookingSideBarpoints = ({label, heading} : {label: string, heading: string}) => {
    return (
        <div className="text-sm">
            <div className="font-medium">{heading}</div>
            <div className="text-gray-600">{label}</div>
        </div>
    )
}

export default BookingSideBarpoints