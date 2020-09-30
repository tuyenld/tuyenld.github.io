---
title: Tự DIY màn hình cho Raspberry Pi, sử dụng màn hình laptop cũ
categories:
  - Raspberry
---

Mục đích của mình là làm 1 cái màn hình cho Raspberry Pi. Màn hình này
có đầu vào là VGA/HDMI nên bạn có thể sử dụng cho cả Laptop, hoặc bất
cứ thiết bị nào có thể xuất hình ra VGA/HDMI.

Các bước cần chuẩn bị:

---
* ToC
{:toc}
---

Nào, bắt đầu thôi.

# 1\. Chọn màn hình

Tiêu chí tìm màn hình:

  - màn hình Laptop cũ (mỏng, nhẹ, dễ dàng đem đi)
  - màn càng to càng tốt

(theo mình với màn 15.6 inch trở lên nên chọn màn có độ phân giải từ HD+
(1600 x 900) trở lên; còn với màn dưới 15 inch thì độ phân giải HD là ổn rồi, dùng FullHD thì mắt cũng sẽ không thấy sự khác biệt)

Cuối cùng mình tìm được màn này ở Shopee [Màn hình LCD Laptop Chạy Đèn cao áp 17.1 IN WIDE 30 Pin](https://shopee.vn/M%C3%A0n-h%C3%ACnh-LCD-Laptop-Ch%E1%BA%A1y-%C4%90%C3%A8n-cao-%C3%A1p-17.1-IN-WIDE-30-Pin-i.78704495.7650696561)
với cấu hình như sau:

  - Name: LP171WP4(TL)(R1)
  - Part Type: LCD Screen
  - Size: 17" WideScreen
  - Resolution: WXGA+ (1440x900)
  - Surface Type: Matte
  - Video Connector: 30 pin CCFL screen

Đây là hình ảnh của em nó từ shop trên Shopee:

![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image8.png)
![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image10.png)
![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image16.png)

Sau khi đã có màn hình rồi, ta cần tìm bộ controller phù hợp cho nó.
Để tìm controller phù hợp, các thông số sau cần được lưu ý:

1. Màn là LCD/LED và bo đèn nền tương ứng
2. Tìm controller điều khiển màn hình
    1. Điện áp hoạt động 3.3V/5V/12V
    2. Độ phân giải của màn hình.
    3. Cáp kết nối với màn hình

Những thông tin này sẽ được làm rõ ở các phần dưới đây.

# 2\. Xác định màn là LCD/LED và bo đèn nền tương ứng

## 2.1 Sự khác biệt giữa LCD và LED



|              | LCD                                                          | LED                                                          |
| ------------ | :----------------------------------------------------------- | ------------------------------------------------------------ |
| Đặc điểm     | LCD là công nghệ hiển thị hình ảnh gồm 2 thành phần chính: Đèn nền (1) và bộ lọc ánh sáng (2-6) (xem hình dưới).  Thời kỳ phát triển đầu tiên của LCD người ta sử dụng bóng cao áp để làm đèn nền. Bóng này chỉ làm một nhiệm vụ duy nhất là tạo ra ánh sáng trắng, khi màn hình hoạt động, đèn này luôn luôn được bật.  Tiếp theo là bộ lọc ánh sáng: bộ lọc này có vai trò lọc ánh sáng đơn sắc từ ánh sáng trắng. Ánh sáng trắng do đèn nền phát ra bao gồm nhiều ánh sáng trắng. | LED là công nghệ ra đời sau LCD, về bản chất hoạt động vẫn giống như LCD, nhưng sử dụng đèn nền là đèn LED.  Vì cơ chế hoạt động của đèn cao áp (dùng cho màn LCD) và đèn LED (dùng cho màn LED) là khác nhau nên controller màn hình phải có những module để kích sáng đèn nền tương ứng. |
| Mạch đèn nền | Phải dùng bo cao áp LCD đa năng [1 bóng](https://shopee.vn/Bo-Cao-%C3%A1p-LCD-%C4%91a-n%C4%83ng-1-b%C3%B3ng-(Kh%C3%B4ng-b%E1%BA%A3o-h%C3%A0nh)-i.24781698.971003892) hoặc [2 bóng](https://shopee.vn/Cao-%C3%A1p-%C4%91a-n%C4%83ng-2-b%C3%B3ng-mi%E1%BB%87ng-l%E1%BB%9Bn-(Kh%C3%B4ng-b%E1%BA%A3o-h%C3%A0nh)-i.24781698.1042681705) tùy vào màn hình | [Cao áp LED đa năng LED driver (Không bảo hành)](https://shopee.vn/product/24781698/970956735/) <br> - Không dùng được cho cao áp Neon, chỉ dùng cho đèn LED <br> - [Bo cao áp LED - Bo LED driver 12 đầu sử dụng cho màn LCD thông dụng và Tivi 32 inch](https://youtu.be/FccgQ3yzHfw) |


Sự khác nhau cơ bản của LCD và LED được thể hiện rõ hơn ở hình dưới đây.

![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image5.png "Source: visual.ly")

## 2.2 Nhận biết LCD hay LED

Có 2 cách để nhận biết một màn hình là LED hay LCD:
1.  Tháo ra xem chân kết nối với đèn nền
2.  Tra datasheet

### 2.2.1 Xem chân kết nối với đèn nền

| LCD                                                          | LED                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image6.png) | ![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image9.png) |
| https://youtu.be/RUnLlIcdhig<br/>Cáp kết nối với cao áp chỉ có 2 dây thường là LCD | [What is inside LCD Monitor-LCD Monitor Teardown](https://youtu.be/FPTScqyI_bQ)<br/>Cáp kết nối đèn nền có nhiều hơn 3 dây --> chắc chắn đây là LED (LCD chỉ có 2-3 dây) |



### 2.2.2 Tra datasheet của màn hình

| Màn **LCD** [LP171WP4-TLR1 (LPLA103)](https://www.panelook.com/LP171WP4-TLR1_LG Display_17.1_LCM_parameter_5779.html) | Màn **LED** [LM215WF4-TLG1](https://www.panelook.com/LM215WF4-TLG1_LG Display_21.5_LCM_overview_14788.html) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image1.png) | ![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image18.png) |
| CCFL: [Cold cathode fluorescent lamp](https://en.wikipedia.org/wiki/Cold_cathode_fluorescent_lamp) (thường gọi là đèn cao áp) | WLED: white light-emitting diode (đèn LED ánh sáng trắng)    |



# 3\. Tìm controller điều khiển màn hình

## 3.1 Điện áp hoạt động của màn hình (3.3V/5V/12V)

Tùy vào điện áp hoạt động của màn hình để cấu hình lại bo đa năng.

Ví dụ với bo đa năng [T.V56.031](https://www.aliexpress.com/i/32761261604.html)

![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image15.png)

Kiểm tra thông tin điện áp hoạt động của màn hình thông qua datasheet.
Ví dụ màn [LP171WP4-TLR1 Specification & Datasheets](https://www.panelook.com/LP171WP4-TLR1_LG%20Display_17.1_LCM_parameter_5779.html)

![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image11.png)

**Như vậy phải chuyển chân cắm của bo đa năng về mức 3.3V trước khi kết
nối vào màn hình, nếu không sẽ bị cháy panel ngay.**

**Chú ý**:
Nếu tận dụng bo TV để làm controller cho màn hình laptop thì có thể làm
hỏng màn.

  - Bo TV khi đưa nguồn qua IVDS là 12V khi đưa lên màn 32 inch, trong
khi màn hình laptop với kích thước nhỏ chỉ dùng 5V/3.3V
  - Xem thêm: [Test và tận dụng bo TV 32 40 inch cho màn LCD 18.5 19 20 22 inch](https://youtu.be/V583KKqZN9Q)

![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image12.png)

Trong trường hợp này, cần phải cắt 3 dây nguồn LVDS để nối sang vị trí có nguồn 5V

## 3.2 Độ phân giải của màn hình

Bo đa năng có thể hoạt động được với nhiều màn hình có độ phân giải khác
nhau. Chỉ cần chọn đúng độ phân giải của màn hình, sau đó nạp firmware
tương ứng là bo có thể hoạt động được.

Để kiểm tra độ phân giải của màn hình, tra cứu thông qua datasheet.

Ví dụ với màn [LP171WP4 (TL)(R1)](https://www.panelook.com/LP171WP4-TLR1_LG%20Display_17.1_LCM_parameter_5779.html)
![]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image17.png)
Như vậy muốn bo đa năng có thể chạy được với màn này, ta phải nạp firmware với cấu hình tương ứng là 1440x900

## 3.3 Cáp kết nối với màn hình



| Cách xác định số cặp tín hiệu dựa và số channel và số bit dữ liệu |
| ------------------------------------------------------------ |
| 4 cặp: Single 6 bit (4 cặp thì có 3 cặp màu 1 cặp clock - 3 cặp = 6 bit) = S6<br/>5 cặp: Single 8 bit (4 cặp màu 1 cặp clock = 8 bit) = S8<br/>8 cặp = gấp đôi 4 cặp (6 cặp data, 2 cặp clock) = Double 6 bit = D6<br/>10 cặp = gấp đôi 5 cặp = Double 8 bit = D8 |
| Nếu bạn dùng sai cáp, ví dụ cáp S6 thay bằng S8 hay D8 thì sẽ không có hình, panel không sao cả.Còn nếu cắm ngược đầu dây thì panel sẽ hỏng ngay lập tức. Ở trên board đa năng cổng LVDS có 20 chân chia làm 2 hàng, không có mấu chống cắm ngược mà chỉ có dấu màu nên rất dễ nhầm lẫn, đây điện nguồn đấu nhầm qua dây tín hiệu là cháy panel ngay!<br/><br/>Các bộ cáp tín hiệu có thể gặp:<br/>DF14-20Pin-S6<br/>DF14-20Pin-S8<br/>FIX-30Pin-S8 (power on left) bit<br/>FIX-30Pin-S8 (power on right) bit<br/>FIX-30Pin-D6 (power on left) bit<br/>FIX-30Pin-D8 (power on left) bit<br/>FIX-30Pin-S8 (power on left) bit (for 17''-42'' screen)<br/>FIX-30Pin-S8 (power on right) bit (for 17''-42'' screen)<br/>FPC-LVDS-30Pin-S8 (power on left) bit<br/>FPC-LVDS-30Pin-S8 (power on right) bit<br/>LP-40Pin-S6（LED laptop SD)<br/>LP-40Pin-D6(LED laptop HD)<br/>FIX-51Pin-D8 (power on left) bit (Most universal LVDS cable for 32''-65'' screen)<br/>FIX-51Pin-D8 (power on right) bit (Most universal LVDS cable for 32''-65'' screen)<br/><br/>Xem thêm:<br/>- [Bộ 14 cáp LVDS thông dụng cho bộ Test Panel LCD](https://shopee.vn/B%E1%BB%99-14-c%C3%A1p-LVDS-th%C3%B4ng-d%E1%BB%A5ng-cho-b%E1%BB%99-Test-Panel-LCD-i.24781698.999902667) <br/>- [Độ bo TV LCD đa năng - Bài 2 - Cáp LVDS thông dụng](https://youtu.be/Xo8GvMch0Sg) |

| Cáp tín hiệu                           | Màn hình                                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| 30 pin, 8 cặp tín hiệu, nguồn bên trái | [[lqv77- shopee\] Cáp LVDS 30 pin 8 cặp tín hiệu](https://shopee.vn/Cáp-LVDS-30-pin-8-cặp-tín-hiệu-i.24781698.970988464) <br> ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image13.png "image_tooltip") |
| 30 pin, 8 cặp tín hiệu, nguồn bên phải | ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image19.png "image_tooltip") -- datasheet [LP171WP4-TLR1](https://cdn.datasheetspdf.com/pdf-down/L/P/1/LP171WP4-TLR1_LG.pdf) <br> ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image20.png "image_tooltip") >>>> Double 6 bit >> cần 8 cặp tín hiệu <br> ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image14.png "image_tooltip")  **>>>>** Chân số 1,2,3 là nguồn bên phải nên **LP171WP4-TLR1 dùng 8 cặp tín hiệu, nguồn bên phải** |
| 30 pin, 5 cặp, nguồn bên phải          | [[lqv77 - Shopee\] Cáp 18.5 LVDS 5 cặp tín hiệu - nguồn bên phải - 1ch 8bit 30pin - FIX-30-D8](https://shopee.vn/Cáp-18.5-LVDS-5-cặp-tín-hiệu-nguồn-bên-phải-1ch-8bit-30pin-FIX-30-D8-i.24781698.975336704) <br>![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image7.png "image_tooltip")  -- Áp dụng cho màn: [M185XW01](https://cdn.datasheetspdf.com/pdf-down/M/1/8/M185XW01-V6-AUO.pdf) <br/> ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image3.png "image_tooltip") >>>> Single 8 bit >> cần 5 cặp tín hiệu <br/> ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image4.png "image_tooltip") ![alt_text]({{ site.cloudinaryurl }}2020-09-30-diy-man-hinh-laptop-cu-raspberry/image2.png "image_tooltip") <br/> |



# 4\. Một số loại controller trên thị trường

1. [Combo bo TIVI cho màn laptop 14.1 15.4 15.6 1280x800 1366x768 1440x900 1680x1050 1920x1080](https://shopee.vn/Combo-T.RD8503.03-cho-m%C3%A0n-laptop-14.1-15.4-15.6-1280x800-1366x768-1440x900-1680x1050-1920x1080-i.24781698.1070784975)
  - Giao ngẫu nhiên T.RD8503.03, SKR.03, T.V56.031, M53V5.1 nạp sẵn độ phân giải lựa chọn
2. [BOARD TIVI LCD V59 có HDMI (NẠP FW TỰ ĐỘNG) [Recommended]](https://linhkienst.com/products/board-tivi-lcd-v59-co-hdmi-nap-fw-tu-dong)
  - Có thể nạp firmware (tùy theo độ phân giải của màn hình) qua USB
  - Phầm mềm cho V59 tương thích từng loại màn hình các bạn của thể tải về tại [đây](https://drive.google.com/open?id=0BwrFK1LAQwteOXJfR3JZRDRyVXM)

3. [M.RT2281.E5 vs MT561-MD V2.1 khi nào sử dụng bo nào ?](https://youtu.be/j0Y-oXyGT6I)
  - [MT561-MD V2.1 bo LCD đa năng jum 12V jumper](https://shopee.vn/MT561-MD-V2.1-bo-LCD-%C4%91a-n%C4%83ng-\(jumper-12V\)-i.24781698.975280421) (100k, muốn thay đổi độ phân giải chỉ cần cắm lại header, phù hợp để test nhanh)
  - [RT2281 bo giải mã LCD đa năng có DVI, VGA](https://shopee.vn/RT2281-bo-gi%E1%BA%A3i-m%C3%A3-LCD-%C4%91a-n%C4%83ng-c%C3%B3-DVI-VGA-i.24781698.1264995518) (150k, **ra màu đẹp hơn**, muốn thay đổi độ phân giải phải nạp lại, phù hợp làm màn hình thứ 2)
4. [NT68676(HDMI + DVI + VGA LCD Điều Khiển Ban Bộ LP171WP4(TL)(R1) LP171WP4-TLR1 17" 1440X900](https://aliexpress.com/item/32910674061.html) bao gồm:
> Gõ tên màn hình trực tiếp trên AliExpress, khi đó bộ controller đã được nạp sẵn firmware và đi kèm với bo đèn nền tương ứng.
    2. LCD Controller board (sử dụng cho màn LP171WP4(TL)(R1))
    2. Inverter (bo cao áp)
    3. LVDS cable
    4. Keypad

# 5\. Troubleshooting

1. [Các bài viết về độ LCD đa
năng](http://kythuatphancung.vn/forum/index.php?/topic/25648-c%C3%A1c-b%C3%A0i-vi%E1%BA%BFt-v%E1%BB%81-%C4%91%E1%BB%99-lcd-%C4%91a-n%C4%83ng/)
2. [Hướng dẫn sử dụng T.VST59.031 - Board TIVI LCD V59](http://kythuatphancung.vn/forum/index.php?/topic/34905-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-s%E1%BB%AD-d%E1%BB%A5ng-tvst59031-board-tivi-lcd-v59/&/topic/34905-h%C3%86%C2%B0%C3%A1%C2%BB%C2%9Bng-d%C3%A1%C2%BA%C2%ABn-s%C3%A1%C2%BB%C2%AD-d%C3%A1%C2%BB%C2%A5ng-tvst59031-board-tivi-lcd-v59/?p=138842)
3. [V56 TV board đa năng - chỉ phân biệt độ phân giải](https://youtu.be/ld5ODhB4n8g)
4. [V56 V59 TV board đa năng - Chỉnh màu LVDS Maps - t.vst59.031](https://youtu.be/_1p4y1UwLBs)
  - Enter service mode: 1147
  - Cấu hình lại khi màu bị sai
5. [Độ bo TV cho màn hình M185BGE-L23 1366x768 Led 6p (0386088311)](https://youtu.be/1E9jFeApWhw)
  - Kèm theo hướng dẫn xem datasheet để lắp mạch.

# 6\. Thành phẩm
(Pending)