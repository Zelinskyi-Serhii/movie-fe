import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  image: Yup.string().url("Invalid URL").required("Image URL is required"),
  rating: Yup.number()
    .min(0, "Rating must be between 0 and 10")
    .max(10, "Rating must be between 0 and 10")
    .required("Rating is required"),
  releaseDate: Yup.date().required("Release date is required"),
  description: Yup.string().trim().required("Description is required"),
  actors: Yup.array().of(
    Yup.string().trim().required("Actor name is required")
  ),
  director: Yup.string().trim().required("Director is required"),
  genre: Yup.string().trim().required("Genre is required"),
});
