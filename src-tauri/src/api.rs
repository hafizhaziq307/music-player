use serde_json::Value;
use id3::{Tag, TagLike};
use base64;

#[tauri::command]
pub fn get_metadata_files( filename: &str, path: &str) -> Option<Value> {
    let file_path:String = path.to_string();

    let tag = Tag::read_from_path(file_path).unwrap();
    let title = tag.title();
    let artist = tag.artist();
    let images = tag.pictures();

    if tag.pictures().count() == 0 {
         return Some(serde_json::json!({
          "filename": filename,
          "path": path,
          "title": title,
          "artist": artist,
          "image": {
            "data": "",
            "mime_type": ""
          }
        }));
    }

    // get the first thumbnail only
    let img = images.into_iter().next().unwrap();

    return Some(serde_json::json!({
        "filename": filename,
        "path": path,
        "title": title,
        "artist": artist,
        "image": {
          "data": base64::encode(&img.data),
          "mime_type": &img.mime_type
        }
      }));
}
