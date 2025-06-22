import Image from 'next/image';

const Header = () => {
  return (
    <header className="h-20 w-full bg-[#89CFF0] shadow-sm">
      <div className=" mx-auto w-full h-full px-4 sm:px-6 lg:px-8">
        <div className="flex  w-full h-full ">
          <div className="flex justify-start items-center">
            <Image
              src="/assets/images/logo.png"
              alt="Pet Lab Co."
              width={50}
              height={50}
            />
          </div>
          <div className="flex w-full justify-center items-center">
            <h1 className="text-2xl font-bold font-serif italic text-[#283085]">
              Product Collection
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
