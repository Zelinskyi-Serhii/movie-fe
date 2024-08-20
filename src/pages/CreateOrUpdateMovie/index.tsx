import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik, FieldArray, FormikProvider } from "formik";

import {
  MovieFormValues,
  useCreateMovieMutation,
  useLazyGetMovieByIdQuery,
  useUpdateMovieMutation,
} from "../../redux/features/movie";
import styles from "./styles.module.scss";
import { validationSchema } from "./validation";
import { toast } from "react-toastify";
import { uploadFile } from "../../api/uploadFile";

export const CreateOrUpdateMoviePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movieId");
  const [getMovie, { data }] = useLazyGetMovieByIdQuery();
  const [createMovie] = useCreateMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const formik = useFormik<MovieFormValues>({
    initialValues: {
      title: "",
      image: "",
      rating: 0,
      releaseDate: "",
      description: "",
      actors: [""],
      director: "",
      genre: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (data?._id) {
        await updateMovie({
          ...values,
          _id: data._id,
          releaseDate: new Date(values.releaseDate),
        });

        toast.success("Movie updated successfully");
      } else {
        await createMovie({
          ...values,
          releaseDate: new Date(values.releaseDate),
        });
        toast.success("Movie created successfully");
      }

      navigate("/movies");
    },
    enableReinitialize: true,
  });

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsLoadingFile(true);
      const response = await uploadFile(file);

      if (response.data.url) {
        formik.setFieldValue("image", response.data.url);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Unable to upload file. Please try again later.");
      }
    } catch {
      toast.error("Unable to upload file. Please try again later.");
    } finally {
      setIsLoadingFile(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      getMovie(movieId);
    }
  }, [getMovie, movieId]);

  useEffect(() => {
    if (data) {
      formik.setValues({
        title: data.title || "",
        image: data.image || "",
        rating: data.rating || 0,
        releaseDate: data.releaseDate
          ? new Date(data.releaseDate).toISOString().split("T")[0]
          : "",
        description: data.description || "",
        actors: data.actors.length ? data.actors : [""],
        director: data.director || "",
        genre: data.genre || "",
      });
    }
  }, [data, formik.setValues]);

  return (
    <section className={styles.createOrUpdateMovie}>
      <h1 className={styles.createOrUpdateMovie__title}>
        <button onClick={() => navigate(-1)}>back</button>
        {data?._id ? "Update Movie" : "Create Movie"}
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className={styles.createOrUpdateMovie__form}
      >
        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.title}
            </div>
          ) : null}
        </div>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <div className={styles.createOrUpdateMovie__url}>
            <label>
              Image URL
              <input
                id="image"
                name="image"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.image}
              />
            </label>
            <label className={styles.createOrUpdateMovie__uploadFile}>
              {isLoadingFile ? 'Loading...' : 'Upload File'}
              <input
                type="file"
                onChange={handleUploadFile}
                className={styles.createOrUpdateMovie__uploadFile}
              />
            </label>
          </div>
          {formik.touched.image && formik.errors.image ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.image}
            </div>
          ) : null}
        </div>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="rating">Rating</label>
          <input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rating}
            min={0}
            max={10}
          />
          {formik.touched.rating && formik.errors.rating ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.rating}
            </div>
          ) : null}
        </div>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="releaseDate">Release Date</label>
          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.releaseDate}
          />
          {formik.touched.releaseDate && formik.errors.releaseDate ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.releaseDate}
            </div>
          ) : null}
        </div>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <FormikProvider value={formik}>
          <FieldArray
            name="actors"
            render={({ push, remove }) => (
              <div className={styles.createOrUpdateMovie__formGroup}>
                <label>Actors</label>
                {formik.values.actors.map((actor, index) => (
                  <div
                    key={index}
                    className={styles.createOrUpdateMovie__actorField}
                  >
                    <input
                      name={`actors[${index}]`}
                      value={actor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={`Actor ${index + 1}`}
                    />
                    {(formik.touched.actors as unknown as boolean[])?.[index] &&
                    formik.errors.actors?.[index] ? (
                      <div className={styles.createOrUpdateMovie__error}>
                        {formik.errors.actors[index]}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={styles.createOrUpdateMovie__removeBtn}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push("")}
                  className={styles.createOrUpdateMovie__addBtn}
                >
                  Add Actor
                </button>
              </div>
            )}
          />
        </FormikProvider>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="director">Director</label>
          <input
            id="director"
            name="director"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.director}
          />
          {formik.touched.director && formik.errors.director ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.director}
            </div>
          ) : null}
        </div>

        <div className={styles.createOrUpdateMovie__formGroup}>
          <label htmlFor="genre">Genre</label>
          <input
            id="genre"
            name="genre"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.genre}
          />
          {formik.touched.genre && formik.errors.genre ? (
            <div className={styles.createOrUpdateMovie__error}>
              {formik.errors.genre}
            </div>
          ) : null}
        </div>

        <button type="submit" className={styles.createOrUpdateMovie__submitBtn}>
          {data?._id ? "Update Movie" : "Create Movie"}
        </button>
      </form>
    </section>
  );
};
