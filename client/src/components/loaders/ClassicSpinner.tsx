const ClassicSpinner = ({size = 5}) => {
  return (
    <div className={`h-${size} w-${size} border-4 border-t-black border-gray-300 rounded-full animate-spin`}></div>
  )
}

export default ClassicSpinner
