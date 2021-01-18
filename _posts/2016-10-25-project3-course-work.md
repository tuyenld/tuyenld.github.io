---
layout: post
title: Project  (Course work)
categories: [embedded]
comments: true
maths: 1
---

# Project 3

{% include tip.html content="Vài lưu ý khi sử dụng camera PTZ điều khiển qua RS485." %}
 

Camera nó sẽ trông như thế này: 

![camera-cvbs-ptz]({{ site.cloudinaryurl }}2016-10-25-project3-course-work/camera-cvbs-ptz.jpg)

Đầu ra của chiếc camera mình dùng là CVBS (Composite Video Blanking and Sync) có chất lượng thấp hơn so với RGB hay S-video. Cổng màu vàng này thường gọi là cổng **Composite video**. Composite video thường sử dụng định dạng NTSC, PAL hoặc SECAM (dây vàng) đây là tín hiệu tương tự.
RCA Cable là cáp kết nối Audio, Video (dây vàng) dùng cho đầu đĩa đời cũ (dây vàng, trắng, đỏ)

Đây cũng là camera có thể quay 360 độ, lên xuống 90 độ gọi là Camera Speed dome, chức năng PTZ (pal till zoom)


JPEG là kỹ thuật nén 1 ảnh YUV theo DCT còn MJPEG là kỹ thuật truyền ảnh liên tiếp để tạo thành video
Muốn tạo ảnh không có nền thì cần thêm Alpha Channel cho ảnh PNG

## RS232, RS485, UART

- RS232 dùng 3 dây để truyền tín hiệu Rx, Tx, GND, là chuẩn nối tiếp không đồng bộ 
  - Mức 0 (mức cao) từ +3 đến +15V
  - Mức 1 (mức thấp) từ -3 đến -15V
  - -> Truyền tối đa 50m, tốc độ tối đa 9600 bps
- RS485 sử dụng 2 dây D+ và D- để truyền vi sai
  - Mức 0: -1.5V đến -5V
  - Mức 1: +1.5V đến +5V
  - -> Truyền bán song công, cự ly 1.2 km, tốc độ tối đa 10Mbps
- UART: chỉ dùng để chỉ chuẩn kết nối Tx, Rx nói chung còn điện áp như thế nào thì phải xem spec??
- Module MAX485 dùng để chuyển UART <-> RS485
  - UART ở chế độ truyền, RS485 ở chế độ nhận
    - DE (MAX485) kéo lên 5V, $$ \overline{RE} $$ (MAX485) kéo lên 5V
    - Dây xanh TX (UART) nối với DI của MAX485
    - Dây xanh RX (UART) không cần quan tâm trong chế độ truyền 
    - A (MAX485) nối với A (thiết bị RS485 khác)
    - B (MAX485) nối với B (thiết bị RS485 khác)
  - UART ở chế độ nhận, RS485 truyền
    - DE kéo xuống 0V, $$ \overline{RE} $$ kéo xuống 0V
    - Dây trắng RX (UART) nối với R0 của MAX 485
    - Dây xanh TX (UART) không cần quan tâm trong chế độ nhận
    - A (MAX485) nối với A thiết bị RS485 khác
    - B (MAX485) nối với B thiết bị RS485 khác


Đây là mạch nguyên lý kết nối UART với module MAX485

  ![so-do-nguyen-ly-MAX485]({{ site.cloudinaryurl }}2016-10-25-project3-course-work/so-do-nguyen-ly-MAX485.png)

# Project 2 + WiFi ESP8266

Project này sử dụng ESP8266 để truyền thông tin từ cảm biến CO2 lên server [thingspeak.com](https://thingspeak.com/) 

## ESP8266
Với mỗi nhà sản xuất thì chân cắm (pin out) sẽ khác nhau. Với sản phẩm của Minh Hà thì sơ đồ chân sẽ trông như thế này khi nhìn từ mặt nhẵn dùng để cắm chân
```bash
      +---------------------------+-------+---+
      |                           |       |   |
VCC <-| x x -> Rx                 |       |   |
RST <-| x x -> GPIO               |  +----+   |
CH-PD | x x -> GPIO2              |  |        |
Tx  <-| x x -> GND                |  +-----+  |
      |                           +--------+  |
      |                                       |
      +---------------------------------------+

```

- Baudrate là 115200
- Chân CH-PD phải kéo lên 3.3V, RST có thể không cần

Với module USB to COM PL2303 v2 Minh Hà thì đầu ra 4 dây là: 

- Dây xanh - Tx (xanh thế)
- Dây trắng - RX
- Dây đen - GND
- Dây đỏ - VCC 5V (chú ý không dùng dây này trong trường hợp thông thường)

UART trong ESP8266 là truyền nhận nối tiếp

- Truyền A => UART trong ESP8266 trả về A ngay, truyền T trả về T ngay
- Do đó phải chờ cho đến khi ESP8266 trả lời xong hết mới truyền tiếp không là bị lỗi ngay.

Các bước để truyền dữ liệu từ ESP8266 lên thinkspeak (chú ý: các lênh AT đều phải kết thúc bởi \<CR\>\<LF\> trong Hercules hoặc `\r \n` trong lập trình với vi điều khiển)

1. Đăng ký tài khoản trên thingspeak.com (TS)
   1. Tạo 1 kênh để up dữ liệu lên
   2. Tạo các trường (Field) để xác định dữ liệu
   3. Ghi lại API write key
2. Kết nối ESP8266 vào mạng Wi-Fi
   - Cấu hình là station: 
   ```
   AT+CWMODE=1
   ```
   - Truy vấn các mạng có thể kết nối 
   ```
   AT+CWLAP
   ```
   - Kết nối đến mạng Wi-Fi: 
   ```
   AT+CWJAP="Tên mạng Wi-FI","Mật khẩu"
   ```
   - Cài đặt ESP8266 có thể kết nối với nhiều kênh : 
   ```
   AT+CIPMUX=1
   ```
3. Trao đổi dữ liệu với thingspeak.com
   1. Kết nối đến server api.thingspeak.com bằng lệnh : 
   ```
   AT+CIPSTART=<id>,"TCP","184.106.153.149",80
   ```
   (trong đó `id` là kênh mà ESP sẽ dùng để đưa dữ liệu lên TS, có thể từ 0:4, do thiết lập `CIPMUX=1` trước đó)
   2. Truyền dữ liệu lên server
      1. Xác định kênh sẽ truyền và kích thước 
      ```
      AT+CIPSEND=<id>,"độ dài thông tin cần truyền lên server"
      ```
      2. Truyền dữ liệu lên server: 
      ```
      GET /update?key=<Write_API_key>&<field_x>=<số liệu truyền đi>
      ``` 
      Trong đó : 
        - `Write_API_key` là giá trị key đã lấy ở bước 1, 
        - `field_x`là trường thông tin đã tạo trên TS (từ field1 đến field8) <br>
        
      **Chú ý:** 
        - Độ dài chuỗi ký tự phải cộng thêm 2 (`<CR> và <LF>`)  
        - Mỗi lần gửi dữ liệu phải lặp lại toàn bộ các bước do kết nối tự động bị Closed
        - Nếu kết nối không tự động close thì dùng lệnh sau để close `AT+CIPCLOSE=<id>` với `id` là kênh đang mở để trao đổi dữ liệu với SP. 
        - TS chỉ cho update dữ liệu dạng number, muốn up dữ liệu dạng string thì phải up qua trường `status` 
        - TS cho chống DDOS nên không thể request đến máy chủ TS liên tục được (15s)
   3. Nhận dữ liệu 
      Sau khi truyền dữ liệu lên server thì nó sẽ gửi về dữ liệu có dạng: 
      ```
      +IPD,len:data với CIPMUX=0
      ``` 
      hoặc
      ```
      IPD,id,len:data với CIPMUX=1
      ```
      Trong đó : `id` là kênh mà ESP8266 dùng để trao đổi dữ liệu, `len` là số byte, `data` là dữ liệu nhận về từ server.