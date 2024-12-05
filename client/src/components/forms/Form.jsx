import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { addRows } from "features/tableSlice";
import formSchema from "utils/validations/form";
import toast from "react-hot-toast";
import { hasDuplicateValues } from "../../utils/hasDuplicateValues";
import SubmitButton from "../common/SubmitButton";
import TableContent from "./TableContent";

const Form = () => {
  const rows = useSelector((state) => state.productos.rows);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, isSubmitting, isSubmitSuccessful },
    setValue,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const submitHandler = (data) => {
    if (hasDuplicateValues([...rows, { id: data.id }], "id")) {
      toast.error("Duplicate ID! Please choose a different ID.");
      return;
    }
    const formattedData = {
      ...data,
      fecha_creacion: new Date(data.fecha_creacion).toISOString(),
    };
    dispatch(addRows(formattedData));
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-blue-200 w-72 p-5 rounded-xl shadow-xl m-auto relative"
      >
        <label className="input input-bordered input-sm flex items-center gap-2 my-3">
          <input
            type="text"
            {...register("id")}
            className="grow"
            placeholder="ID"
          />
        </label>
        <label className="input input-bordered input-sm flex items-center gap-2 my-3">
          <input
            type="text"
            {...register("nombre")}
            className="grow"
            placeholder="Name"
          />
        </label>
        <label className="input input-bordered input-sm flex items-center gap-2 my-3">
          <input
            type="text"
            {...register("descripcion")}
            className="grow"
            placeholder="Description"
          />
        </label>
        <label className="input input-bordered input-sm flex items-center gap-2 my-3">
          <input
            type="number"
            {...register("precio")}
            className="grow"
            placeholder="Price"
          />
        </label>
        <label className="input input-bordered input-sm flex items-center gap-2 my-3">
          <input
            type="date"
            {...register("fecha_creacion")}
            className="grow"
            placeholder="Creation Date"
          />
        </label>
        <SubmitButton
          title={"Add"}
          isDirty={isDirty}
          isValid={isValid}
          isSubmitting={isSubmitting}
        />
      </form>
      <TableContent />
    </>
  );
};

export default Form;