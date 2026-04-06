import PostForm from "../_components/post-form";
const CreatePage = () => {

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <PostForm />
      </div>
    </div>
  )
}

export default CreatePage