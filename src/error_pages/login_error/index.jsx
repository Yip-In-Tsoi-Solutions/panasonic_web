const LoginError = () => {
  return (
    <>
      <div className="grid h-screen place-content-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-200">403</h1>
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Token Expired or User is Not Found
          </p>
          <p className="mt-4 text-gray-500">
            Sorry, the token you are using is either expired or not found.
            Please request a new token or try logging in again.
          </p>
          <a
            href="/"
            className="uppercase cursor-pointer mt-6 inline-block rounded bg-[#006554] px-5 py-3 text-sm font-medium text-white hover:bg-[#006554]-700 focus:outline-none focus:ring"
          >
            Go Back LOGIN PAGE
          </a>
        </div>
      </div>
    </>
  );
};
export default LoginError;
