import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be laoded");
  }

  return data;
}

export async function createCabin(cabin) {
  const imageName = `${Math.random()}-${cabin.image.name}`.replaceAll("/", "");

  const hasImagePath = Boolean(typeof cabin.image === "string");

  if (hasImagePath) {
    const imagePath = cabin.image;
    const { error } = await supabase
      .from("cabins")
      .insert({ ...cabin, image: imagePath });
    if (error) {
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created"
      );
    }
    return;
  }

  // 1. Upload img to bucket

  const { data: url, error: imgError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, cabin.image);
  if (imgError) throw new Error("Cabin image could not be uploaded");

  // 2. Retrieve image full public path
  const { data } = supabase.storage.from("cabin-images").getPublicUrl(url.path);

  // 3. Insert whole cabin data into table with dynamically fetched path
  const newCabin = { ...cabin, image: data.publicUrl };

  const { error } = await supabase.from("cabins").insert([newCabin]);

  if (error) {
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  // const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // https://mlbdgvqecxxyjfjfuzri.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // // 1. Create cabin
  // const { data, error } = await supabase
  //   .from("cabins")
  //   .insert([{ ...newCabin, image: imagePath }])
  //   .select();

  // if (error) {
  //   console.error(error);
  //   throw new Error("Cabin could not be created");
  // }

  // // 2. Upload image
  // const { error: storageError } = await supabase.storage
  //   .from("cabin-images")
  //   .upload(imageName, newCabin.image);

  // // 3. Delete the cabin if there was an error uploading image
  // if (storageError) await supabase.from("cabins").delete().eq("id", data.id);
  // console.error(storageError);
  // throw new Error(
  //   "Cabin image could not be uploaded and the cabin was not created"
  // );
}

export async function editCabin(newCabin) {
  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl); // checks if add a new image crom the name

  const imagePath = hasImagePath
    ? newCabin.image // if use the one that already have
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`; // if not add a new image

  const { data, error } = await supabase
    .from("cabins")
    .update({ ...newCabin, image: imagePath })
    .eq("id", newCabin.id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }
  // 2. Upload image only if a new is selected
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(`${imageName}`, newCabin.image);
    // 3. Delete the cabin if was an error uploading image
    if (storageError) {
      await deleteCabin(data.id);
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created"
      );
    }
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
