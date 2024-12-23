use serde_json::Value;
use id3::{Tag, TagLike};
use base64;

#[tauri::command]
fn get_metadata_files( filename: &str, path: &str) -> Option<Value> {
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


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_metadata_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
