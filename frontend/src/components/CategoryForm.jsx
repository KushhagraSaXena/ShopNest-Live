const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full bg-gray-100 dark:bg-[#1f2937] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-pink-500"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between">
            <button className="bg-blue-600 dark:bg-pink-500 text-white hover:bg-blue-700 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-pink-500 focus:ring-opacity-50 py-2 px-4 rounded-lg">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              aria-label="Delete category"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          )}

        </div>
      </form>
    </div>
  );
};

export default CategoryForm;