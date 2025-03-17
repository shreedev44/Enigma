const CommandLoader = () => {
  return (
    <div className="mx-auto w-[500px] dark:bg-black bg-secondary rounded-xl overflow-hidden drop-shadow-xl">
      <div className="p-2.5 text-[#0f0]">
        <div>
          <span className="mr-2">Testing</span>
          <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
          <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
          <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
        </div>
      </div>
    </div>
  );
}

export default CommandLoader;
