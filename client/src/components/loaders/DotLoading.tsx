const DotLoading = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-3 h-3 rounded-full dark:bg-gray-50 bg-gray-800 animate-bounce" />
      <div className="w-3 h-3 rounded-full dark:bg-gray-50 bg-gray-800 animate-bounce [animation-delay:-.3s]" />
      <div className="w-3 h-3 rounded-full dark:bg-gray-50 bg-gray-800 animate-bounce [animation-delay:-.5s]" />
    </div>
  );
}

export default DotLoading;
