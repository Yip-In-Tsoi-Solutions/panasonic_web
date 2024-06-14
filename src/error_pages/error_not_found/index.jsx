const NotFoundError = () => {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can't find that data in database.
            </p>
            <a
            onClick={()=> history.back()}
            className="uppercase cursor-pointer mt-6 inline-block rounded bg-[#006554] px-5 py-3 text-sm font-medium text-white hover:bg-[#006554]-700 focus:outline-none focus:ring"
          >
            back to previous page
          </a>
          </div>
        </div>
      </section>
    </>
  );
};
export default NotFoundError;
