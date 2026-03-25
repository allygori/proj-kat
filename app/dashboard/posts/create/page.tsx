// import { CreatePostForm } from "@/app/dashboard/posts/_components/form";
// import { CreatePostForm as CreatePostForm2 } from "@/app/dashboard/posts/_components/form-2";
import Form3 from "../_components/form-3";
const CreatePage = () => {
  
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <Form3 />
        {/* <CreatePostForm /> */}
        {/* <CreatePostForm2 /> */}
      </div>
    </div>
  )
}

export default CreatePage