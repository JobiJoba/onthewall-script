import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dwffsc6ft",
  api_key: "596615268882194",
  api_secret: "EqM3th-zesmLzFjvv_zYW_cPq-E",
})

cloudinary.uploader.upload(
  "./To-Sell/10-16-mockup/WM-OTW-292.jpg",
  { public_id: "WM-OTW-292" },
  function (error, result) {
    console.log(result)
  }
)
