// Based on a script by Kathie Decora : katydecorah.com/code/lunr-and-jekyll/

// Create the lunr index for the search
var index = elasticlunr(function () {
  this.addField('title')
  this.addField('author')
  this.addField('layout')
  this.addField('content')
  this.setRef('id')
});

// Add to this index the proper metadata from the Jekyll content

index.addDoc({
  title: "How to use Google Analytics API",
  author: null,
  layout: "post",
  content: "Update August 26, 2020: I don’t use this feature on my site any more. However, you can see my old script here.\n\nThe previous webstite screenshoot look like following.\n\n\n  \n\n\n\n\nI want to display pageview on my blog (you can see the “eye” icon near the date of the post). One problem is this blog is static blog (powered by Jekyll), so I think about use Google Analytics to do that. I found a ton of document, there are many keyword on Google Cloud Product.\n\n  Services Account\n  Access Token\n  Fresh Token\n  OAuth 2.0\n\n\nDo I need spend all my free time to understand these?\n\nI don’t know where can I start, I just want to it as simple as possible.\nUsing google API is not easy task for me in the first time, even it is several line of code. I tried to find a sample example on github page, but I failed. I can’t find any instruction one by one to do that. Therefore, I want to share with you how can I do that. Let’s see.\n\n1. Setting on your account\nIn this step you need to find:\n\n  Your Profile ID: profileID\n  Service account private key (KEY_FILEPATH *json file)\n\n\n1.1 Add a Services Account\n1. Goto Google console\n2. Click Create service account on the top, near navigation bar.\n\n  \n\n3. Click CREATE KEY, choose json\n\nYou are able to download this private json file only one time.\n\n\n  \n\n\nAfter finish, you will see something like this.\n\n  \n\n\n1.2 Add the Services Account to your Google analytics service\n\n1. Goto Google analytics\nit will redirect you to link like this:\nhttps://analytics.google.com/analytics/web/#/a133437467w193286472p188904382/admin/account/settings\n\n\n/a[6 digits]w[8 digits]p[8 digits]\n\nThe 8 digits which after the “p” are your profile ID. (in my case this is 188904382)\n\n2. Click User Management\n\n  \n\n\n3. Click + on the top to add Service Account &gt; Click Add users\n\n  \n\n\n  \n\n\nAfter finish, you will see something as following.\n\n  \n\n\n2. Using ruby\n\n\n\nSample output as following.\n20\n/life/nguoi-la-mai-thao-yen.html\n1\n/life/nguoi-la-mai-thao-yen/\n13\n/openwrt/2019/02/11/upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb.html\n1\n/openwrt/upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb\n\n\n3. Using python\n\n\n\nSample output as following.\n['/about.html', '2'],\n['/archive.html', '5'],\n['/archive.html?tag=An+Nam', '1'],\n['/archive.html?tag=Nguyễn+Ái+Quốc', '2'],\n['/archive.html?tag=Văn+học', '7'],\n['/archive.html?tag=life', '1'],\n['/categories/', '18'],\n['/header-image', '4'],\n['/kkk', '3'],\n\n\n4. Some error you may encounted\n\nError: Authorization failed. Server message: { \"error\": \"invalid_grant\", \"error_description\": \"Invalid JWT: Token must be a short-lived token (60 minutes) and in a reasonable timeframe. Check your iat and exp values and use a clock with skew to account for clock differences between systems.\" }\n             Error: Run jekyll build --trace for more information.\n\nI use Ubuntu on my Virtual box but the Ubuntu time is not synced. Solution is update time on Ubuntu: sudo ntpdate time.nist.gov`\n\n5. References\n\n  Google Query Explorer\n  Martin Fowler blog\n  Jekyll-Ga-V2 A Plugin To Get Google Analytics Data Into Your Site - Jekyll static site\n\n",
  id: 0
});
index.addDoc({
  title: "Brazil bâng quơ",
  author: null,
  layout: "post",
  content: "Anh đã làm mọi thứ để không phải đi, vì anh biết rằng chuyến đó sẽ chẳng dễ dàng gì. Support xuyên đêm anh cũng đã thử, anh đã cố nghĩ hết các trường hợp có thể xảy ra, nhưng không có kết quả. Và rồi cái gì đến cũng phải đến, anh phải đi mặc dù tâm trí đang đâu đâu, kế hoạch là gì anh không biết, anh chưa từng gặp phải tình huống như vậy. Và vì để chứng tỏ người Việt Nam mình không thua kém, anh đi.\nCảm giác khó chịu đầu tiên là chuyên bay dài quá, phải mất 8h đồng hồ từ VN -&gt; Qatar, và anh lại phải transit 8h nữa ở Qatar để rồi mất thêm 16h nữa từ Qatar -&gt; Sao Paulo, vậy là anh sẽ mất 32h đồng hồ để đến nơi cần đến. Cảm giác đầu tiên khi đến Qatar là bọn nó làm ăn chuyên nghiệp hơn mình nhiều. Mình đang lơ ngơ không biết khu vực transit đi lối nào thì đã có ngay 1 thằng nhân viên ra hỏi và giúp đỡ tận tình. Tiếp đến là cần phải tìm nơi nào đó để ngủ. Ở Qatar có rất nhiều Sleeping room xếp dọc lối đi ra các cửa ra máy bay hoặc gần khu vực vệ sinh. Nếu không biết thì bạn có thể hỏi bất cứ nhân viên nào ở đó.\nNào dậy đi, anh còn cần bay thêm 16h nữa. Đây là thời gian tù nhất, vì ngủ nhiều thì đau đầu, không ngủ thì không biết làm gì cả. Xem TV thì nó đặt gần quá, mắt mình lại 11/10 nên nhìn gần rất là khó chịu, có lẽ lần sau nên đi vé thương gia xem thế nào :laughing:\nThôi thì trầy trật mãi cũng đến Sao Paulo, một thành phố anh được nghe nói là đầy nguy hiểm. Tuy nhiên, anh đâu có tâm trí để ý đến điều đó. Cái làm anh suy nghĩ là làm sao cho xong việc còn về. Khó khăn mới chỉ bắt đầu, tuần đầu tiên anh đến chỗ khách hàng vài lần, không tìm thấy lỗi và câu chuyện còn dài lắm. Dự định của anh đầu tiên là 14 ngày, nhưng phải đến 42 ngày anh mới được về nhưng mới chỉ hoàn thành 70% công việc.\nAnh có tuyệt vọng không?\n\n  Có.\n\nAnh có bao giờ muốn từ bỏ mọi thứ không?\n\n  Tất nhiên là có, vì mình không biết bắt đầu từ đâu, có quá nhiều dữ liệu đầu vào, mình lại không có nhiều thời gian.\n\nBây giờ khi đã có một phần đáp án thì nếu cho bắt đầu lại, anh sẽ bắt đầu như thế nào?\n\n  Thực ra cho đến bây giờ, nếu cho bắt đầu lại thì anh vẫn không biết bắt đầu như thế nào. Thế giới phần mềm quả thật rộng lớn, bất cứ một lỗi nào dù nhỏ cũng có thế phá hỏng hệ thống, vì nó rộng lớn quá so với thời gian anh có nên anh như bị chôn chân trong chính suy nghĩ của mình.\n\nKhi một mình trên một đất nước xa lạ, đồng nghiệp thì ở xa và khác múi giờ, anh chỉ còn biết trông chờ vào chính mình. Cũng từ đây, anh hiểu thế nào là tự lập, thế nào là sự cô đơn và niềm tin anh đặt vào chính mình. Chỉ cần một hướng đi sai, anh có thể mất cơ hội để tìm ra vấn đề. Người ta nói rằng “What doesn’t kill you, makes you stronger!”, điều duy nhất anh có thể bám víu để tiếp tục, để không gục ngã.\nVào thứ 7, chủ nhật khi không phải đi làm, anh có thời gian nghĩ lại về cuộc đời mình. Một suy nghĩ cứ mãi luẩn quẩn trong đầu anh “What is your dream?”. Không biết bao nhiêu lần anh tự hỏi mình như thế. Và ở đây, một đất nước xa lạ, nó làm anh chạnh lòng.\nChuyến đi này có phải nằm trong dự định của anh?\n\n  Không, anh không muốn đến nơi đây, tại sao anh phải đến đây cơ chứ? Anh sẽ tìm được giấc mơ của mình ở đây chăng? Có thể lắm chứ.\n\nDù sao, anh cũng nhận ra được một điều: Nếu không có một quyết tâm vững vàng, một mục đích xác định, và đi đến cùng tới giấc mơ đó thì chắc chắn anh sẽ gục ngã, sẽ buông xuôi. Hành trình tìm kiếm và thực hiện giấc mơ chưa bao giờ và sẽ không bao giờ là dễ dàng cả. Và anh cần phải khắc sâu vào tiềm thức mình điều đó. Thà để anh chết trên con đường đi tìm giấc mơ của mình hơn là chết trong những lo sợ mà không dám tìm kiếm nó.\nAnh bắt đầu nghĩ nhảm, anh thấy sao bọn nó hiện đại hơn mình quá. Đường xá thì không bằng phẳng như mình đâu, mà toàn như kiểu đi trên núi. Nhưng anh chưa thấy người ta vượt đèn đỏ bao giờ, cũng không bóp còi inh ỏi như ở mình, ở đây họ hay dùng tay để ra hiệu :+1: nghĩa là ổn, mày sang đường đi. Hệ thống tàu điện ngầm của bọn này thì to kinh khủng, ở những đoạn nối giữa các line, phải đi bộ đến mấy tầng để chuyển sang line tiếp theo. Trên mỗi toa tàu đều có tiếng Bồ Đào Nha và tiếng Anh, nên sử dụng rất đơn giản.\nNgồi trên tàu điện ngầm, một vài suy nghĩ cứ lẳn quẩn trong tâm trí:\n\n  Người ta sẵn sàng bỏ ra một số tiền lớn để mua một chiếc IPhone, nhưng có ai chấp nhận bỏ ra một số tiền lớn cho một bữa ăn.\n\nDĩ nhiên là không, không ai muốn bỏ ra một khoản lớn cho nhu cầu cơ bản của mình cả. Mặc dù nhu cầu cơ bản là cái quan trọng hơn. Anh có thể chết nếu không ăn uống, nhưng nếu thiếu “Smart phone”, anh vẫn sống ngon ơ. Trước đây, anh thường băn khoăn về con đường phía trước của mình. Anh muốn trở thành một gã nông dân, anh muốn sống trên núi được gần với thiên nhiên.\n\n  Xuân ăn măng trúc, đông ăn giá.\n\nNhưng anh à, đất nước cần những người nông dân như anh từng nghĩ, nhưng đất nước cần hơn những kỹ sư xây tàu điện ngầm, xây sân bay, sản xuất máy tính, điện thoại những thứ cần công nghệ tiên tiến hơn so với công nghệ nông nghiệp. Đứng vào đâu, tập trung vào lĩnh vực nào, lựa chọn là ở anh.\nCòn nữa ….\n",
  id: 1
});
index.addDoc({
  title: "Người lạ - Mai Thảo Yên",
  author: null,
  layout: "post",
  content: "Tôi bắt gặp Người lạ trong bài giới thiệu Văn học tuổi 20 của báo Tuổi trẻ.\nỞ cái tuổi của tác giả và của tôi thì những suy nghĩ về cuộc đời, những câu hỏi không tìm được lời giải khá là rõ nét. Câu chuyện bắt đầu với một sự chơi vơi, sự hoài nghi để rồi kết thúc trong một khoảng không vô định, cô đơn đến nao lòng.\n\n  Dù sao, chính An đã chọn đưa mình đến đây, ngồi ở những bậc thang đá này và mơ về biển khơi. Cái giá phải đánh đổi dù sao cũng vừa vặn và công bằng so với sự tham lam của cô.\n\n\nTrước khi đọc cuốn sách này, tôi cứ nghĩ du học là thiên đường, khi nghe những lời tâm sự của An - mà có thể cũng là chính của tác giả thì mới thấu hiểu phần nào của sống của những du học sinh như An. Đó hẳn phải là một sự hi sinh, chịu đựng rất lớn, nhưng như theo cách cô nói - dù sao nó cũng công bằng với những ước mơ hoài bão của cô.\n\n\n  Nhưng buổi chiều hôm nay, khi chỉ còn An một mình trên bậc thang này, khi thanh âm rõ ràng nhất không đến từ tiếng sóng nước đập vào bờ cuồn cuộn, mà đến từ sự trống trải trong lòng, cô lại thấy mình như một chiếc thuyền đã rời bến. Ở giữa khơi xa, con thuyền này cần những ngọn gió sau lưng, sóng biển bốn bề, và cảm giác lao về phía trước để thấy mình toàn vẹn. Kể cả khi không rõ điểm đến là đâu. Kể cả khi có thể chẳng có điểm đến nào dành cho nó. An có thể đi rất nhiều chân trời, ngắm nhìn cuộc sống muôn màu ở những bến cảng khác nhau, nhưng về sau cùng, cô vẫn cần có biển cả, cần có sự lênh đênh này để nhìn thấy chính mình. Có lẽ kiếp sống này buộc An phải trở thành một người lạ ở chính quê hương cô, ở cả thành phố đã chứng kiến cô trưởng thành, trầy trật, va vấp. Mà cũng có lẽ, nếu người ta có một thứ gọi là bản chất, thì bản chất của An chình là chiếc thuyền đó.\n\n\nĐã bao giờ bạn cảm thấy cô đơn trên chính ngôi nhà của mình, lạc lõng giữa thành phố đầy bon chen, phiền muộn? Và nếu muốn biến mình thành một con thuyền, có thể bơi ra biển lớn, để một lần được hiểu về bản chất của chính mình, bạn có đủ dũng cảm để ra đi? Bạn có đủ nghị lực để vượt qua được sự cô đơn sắp đến?\n\nSẽ chẳng có một câu trả lời nào hoàn hảo, cũng không ai trả lời cho bạn, hoặc nếu có ai đó cho bạn lời khuyên thì chắc gì đã đúng với bạn? Bạn là duy nhất, vậy nên hãy tự tìm câu trả lời cho chính mình. Và khi đã lựa chọn rồi thì cũng đừng quay lại, chẳng có quyết định nào là hoàn toàn đúng hay sai cả. Cuộc sống không đơn giản như vậy, cũng không thể rạch ròi trắng-đen, đúng-sai. Hãy trân quý điều đó vì cuộc sống muôn màu. Điều này có vẻ đi ngược lại thế giới của máy tính, khi chúng ta chỉ có những bit 1 và 0, thế giới của máy tính thật buồn tẻ và đơn giản, còn cuộc sống của chúng ta thì không.\n",
  id: 2
});
index.addDoc({
  title: "Upgrade flash chip on TP-Link from 4mb to 8mb",
  author: null,
  layout: "post",
  content: "1. Pre-requirement\n\n  New flash chip: I used Winbond 8MiB GD25Q64CSIG\n  Soldering iron: desolder old flash chip and re-solder new flash chip\n  ROM programer and IC socket: I am using CH-341A (~ 5$)\n  One PC/Laptop\n\n\n2. Let’s do it\n2.1 Desolder old flash chip\nHot air soldering station is ideally suited for desoldering flash. If you not, you can follow this video to do this.\n\n2.2 Program new flash chip\nFirstly, you need to choose new flash chip you want to replace. Why I chose Winbond GD25Q64CSIG for replacement, see table bellow:\n\n\n\nI see the name of flash chip is the same, so I didn’t checked datasheet for compatible.\n\nSecondly, you need to choose OpenWRT firmware.\nWhy I used openwrt-18.06.1-ramips-mt76x8-tl-wr841n-v13-squashfs-sysupgrade instead of openwrt-18.06.1-ramips-mt76x8-tl-wr840n-v5-squashfs-sysupgrade?\n\nBecause it used the same CPU and different in flash and RAM chip.\n\n\nNote! You are able to use openwrt-18.06.1-ramips-mt76x8-tl-wr840n-v5-squashfs-sysupgrade with 8MB flash chip, your router still booting but you can not any configuration after reboot. You may got error Your image is probably too big, leaving not enough space for jffs2\n\nIn the first time, I faced this problem. I can not save any configuration after reboot. If you look at boot log, it read:\n\n\nNo /overlay will be mounted:\n\n\nIf everything is good, it should be like this:\n\n\nNow, you have new flash chip and suitable firware, but you can not use this firware to program new flash chip. Because RAW flash need more partion than firmware such as: bootloader and art. See more in here\n\nYou can use bellow shell script to generate firmware for any flash with different capacity.\n\n\n\n\nIf you don’t want to use this script, you can create image by yourself. You may to need hex editor like HxDen to do this.\n\n  \n  New firmware layout\n\n\nAll file which I used in here\n2.3 Re-solder new flash chip\nAfter use CH341A to program new flash chip, you can re-solder new flash chip on target board.\n\nNote! If your board can not booting, don’t worry. You can use Clip Socket Adapter to try program flash again with out desolder chip.\n3. Enjoy\n\n  \n  Software with new flash chip (8MB).\n\n\nNote! I used image come from TL-WR841N v13.x, except for LED will not working, everything work well (Wi-Fi, Ethernet, Router feature).\n",
  id: 3
});
index.addDoc({
  title: "Gửi thanh niên An Nam",
  author: null,
  layout: "post",
  content: "Ông Đu-Me, nguyên toàn quyền Đông Dương đã viết:\n\n\n  “Khi nước Pháp đến Đông Dương, thì dân tộc Việt Nam đã chín muồi để làm nô lệ”.\n\n\nTừ đó đến nay hơn một nửa thế kỷ đã trôi qua. Nhiều biến cố phi thường đã làm đảo lộn thế giới. Nhật-Bản đã đứng vào hàng đầu các cường quốc trên thể giới. Trung-Hoa đã làm cách mạng. Nga đã tống cổ lũ bạo chúa đi để trở thành một nước cộng hoà vô sản. Một luồng gió giải phóng mạnh mẽ đã làm cho các dân tộc bị áp bức vùng lên. Người Ai-rơ-lan, Ai-Cập, Triều-Tiên, Ấn-Độ, tất cả những người chiến bại hôm qua và nô lệ hôm nay đó, đương đấu tranh dũng cảm cho nền độc lập ngày mai của họ. Riêng người Việt Nam, thì vẫn cứ thế: sẵn sàng làm nô lệ.\n\nHãy nghe đoạn văn khốn nạn này của một tên khách Việt Nam trong một bữa tiệc hai trăm người ăn, tổ chức ra để chiêu đãi bọn U-tơ-rây, Va-luy-dơ và bè lũ và để ngửi mùi bít tất thối của bọn “liên minh dân tộc” này. Anh chàng Việt Nam ấy đã không ngại bỏ ra 85 quan cho một bữa chè chén. Hắn đọc diễn văn tại bữa tiệc:\n\n\n  “Tôi lấy làm tự hào được thay mặt cho toàn thể cử tọa nói lên tấm lòng tôn kính sâu sắc, niềm vui mừng và lòng biết ơn của chúng tôi đối với các vị. Đối với con mắt khâm phục của chúng tôi, các vị thật là tiêu biểu cho chính phủ của dân tộc Pháp vinh quang. Tôi không tìm ra dược danh từ nào đủ đẹp để nói lên cho thật đúng ý nghĩa của tư tưởng sâu kín trong chúng tôi, nhưng thưa các vị, các vị hãy tin ở tình gắn bó thuỷ chung, ở lòng trung thành, ở sự sùng bái của chúng tôi đối với nước Đại Pháp, là người đỡ đầu và bảo hộ, đã coi chúng tôi như con, không phân biệt mầu da và chủng tộc. Mỗi người của chúng tôi đều đã tự mình nhận thấy tất cả những ân huệ mà Nhà nước chí tôn và những vị đại diện cho nước Đại Pháp đã ban cho chúng tôi bằng cách áp dụng đúng đắn và sáng suốt những luật pháp rộng rãi và khoan hồng.”\n\n\nTrong đám tang viên toàn quyền Lông, ông N.K.V., tiến sĩ luật, tiến sĩ khoa chính trị và kinh tế, làm việc tại toà biện lý Sài Gòn, đã quả quyết rằng, nếu có thể phát biểu thay toàn thể nhân dân Đông Dương, thì ông sẽ đau đớn nói lên lời cảm tạ thiết tha đối với quan toàn quyền về tất cả những gì mà Ngài đã làm cho dân tộc Việt Nam. Rồi ông V. kêu to lên rằng:\n\n\n  “Những người mà nhờ những biện pháp bao dung của Ngài, ngày nay đang đựơc cùng các vị đại diện của Nhà nước bảo hộ góp phần vào sự phồn vinh không ngừng tăng lên của xứ Đông Dương, những người ấy cảm tạ Ngài tự đáy lòng và sùng bái hình ảnh của Ngài. Kinh tế là vấn đề mà Ngài lo nghĩ đến nhiều nhất. Ngài đã muốn cho Đông Dương có đủ trang bị kinh tế để trở thành một nước Pháp thứ hai, một nước Pháp hùng cường ở Viễn Đông, một chi nhánh của nước Pháp Cộng hoà! Ngài đã đem hết tâm hồn, trí não vào sứ mệnh của Ngài là khai hoá cho một dân tộc bị ngăn cản trên con đường tiến bộ vì nhiều điều kiện lịch sử và khí hậu. Ngài là người chiến sỹ vô song của tiến bộ và sứ giả của văn minh…”\n\n\nCòn ông Cao-Văn-Sen, kỹ sư, hội trưởng hội những người Đông dương tại Pháp, thì nói rằng việc ông Lông chết quá sớm là một cái tang cho Đông Dương. Rồi ông kết thúc bài điếu văn bằng những lời sau đây:\n\n\n  “Thưa quan toàn quyền, chúng tôi chân thành thương tiếc Ngài vì đối với tất cả chúng tôi, Ngài là một ông chủ bao dung, khoan thứ như một người cha”.\n\n\nTừ việc trên, tôi xin kết luận rằng, nếu quả thật tất cả những người Việt Nam đều rạp mình sát đất như bè lũ tay sai ấy của chính quyền thì người Việt Nam có phải chịu số kiếp nô lệ, cũng là đáng đời!\n\nThanh niên ta cũng nên cần biết là hiện nay có hơn hai nghìn thanh niên Trung-Hoa trên đất Pháp và độ năm vạn ở châu Âu và châu Mỹ. Hầu hết những thanh niên ấy đều đã tốt nghiệp Hán văn và tất cả đang là sinh viên - công nhân. Còn chúng ta, thì chúng ta có những sinh viên được học bổng và những sinh viên thường, nhờ ơn của nhà nước hay tiền của cha mẹ (hại thay, hai cái nguồn đấy đều không bao giờ cạn cả), mà đang dành một nửa thì giờ vào các việc… chơi bi-a, một nửa của nửa thì giờ còn lại để đến các chốn ăn chơi; số thì giờ còn lại, mà ít khi còn lắm, thì để vào trường đại học hoặc trường trung học. Nhưng sinh viên - công nhân Trung Quốc thì lại không có mục đích nào khác hơn là nhằm thực sự chấn hưng nền kinh tế nước nhà; và họ theo châm ngôn:\n\n\n  “Sinh sống bằng lao động của bản thân và vừa học hỏi vừa lao động”.\n\n\nHọ đã làm như thế này: vừa đặt chân lên đất nước người là tất cả những người có năng khiếu giống nhau và cùng muốn học một nghề thì tập hợp lại thành nhóm để vận động xin việc với bọn chủ. Khi được nhận vào xưởng thợ hay nhà máy thì cố nhiên là họ bắt đầu bằng cách học việc, rồi sau trở thành thợ.\n\nĐối với nhiều người đã được nuôi dưỡng trong cảnh giàu sang và được gia đình chiều chuộng, thì làm những viêc nặng nhọc là một điều gian khổ. Nếu họ không có một quyết tâm vững chắc, không được một sức mạnh tinh thần phi thường thúc đẩy thì phần lớn đã phải chùn bước.\n\nNhưng cho tới nay tất cả vẫn tiếp tục làm việc. Một trở lực thứ hai là ngôn ngữ bất đồng, họ đã khắc phục được trở lực ấy nhờ biết lợi dụng khiếu quan sát, cái khiếu gần như là một bản năng đặc biệt của những người Viễn đông chúng ta. Nếu họ không hiểu được hay hiểu một cách khó khăn những lời chủ họ nói, thì họ chăm chú quan sát những cái mà chủ chỉ cho họ.\n\nHọ kiếm không được bao nhiêu tiền. Với số tiền công ít ỏi, trước hết họ phải tính sao cho đủ sống. Và, họ coi việc không xin tiền chính phủ, không xin tiền gia đình là một vấn đề danh dự. Sau nữa, tuỳ theo số tiền kiếm được họ trích một phần để đóng vào quỹ tương tế do họ lập ra. Quỹ này nhằm hai mục đích:\n\n  Giúp đỡ những sinh viên đau ốm có giấy chứng nhận của thầy thuốc, và những sinh viên thất nghiệp có giấy chứng nhận của chủ.\n  Trợ cấp một số tiền trong một năm cho tất cả những người mới học nghề xong để giúp họ bổ túc nghiệp vụ.\n\n\nLao động ở nước nào, họ cũng xuất bản ở đấy một tờ tạp chí (luôn luôn là do sinh viên - công nhân đóng góp). Tạp chí ấy viết bằng chữ Hán, cung cấp tin tức của Tổ quốc và đăng những vấn đề lớn trên thế giới, v.v… Tạp chí dành một mục cho độc giả trao đổi những việc bổ ích cho việc học nghề của họ, báo cho nhau biết sự tiến bộ của từng người, khuyên nhủ và động viên nhau. Ban ngày họ làm việc, ban đêm họ học tập.\n\nKiên trì, quyết tâm và đoàn kết như thế, các “ông chủ trẻ tuổi” của chúng ta chắc chắn sẽ đạt mục đích. Với một đạo quân 50.000 công nhân dũng cảm đáng khâm phục, lại được đào tạo trong kỷ luật và kỹ thuật hiện đại, thì không bao lâu nữa, Trung Quốc sẽ có địa vị trong hàng các cường quốc công nghiệp và thương nghiệp thế giới.\n\nỞ Đông Dương, chúng ta có đủ tất cả những cái mà một dân tộc có thể mong muốn như: hải cảng, hầm mỏ, đồng ruộng mênh mông, rừng rú bao la; chúng ta có những người lao động khéo léo và cần cù.\n\nNhưng chúng ta thiếu tổ chức và thiếu người tổ chức! Bởi thế công nghiệp và thương nghiệp của chúng ta là một con số không. Thế thì thanh niên của ta đang làm gì? Nói ra thì buồn, buồn lắm: Họ không làm gì cả.\n\n\n  Những thanh niên không có phương tiện thì không dám rời quê nhà; những người có phương tiện thì lại chìm ngập trong sự biếng nhác; còn những kẻ đã xuất dương thì chỉ nghĩ đến việc thoả mãn tính tò mò của tuổi trẻ mà thôi!\n\n\nHỡi Đông Dương đáng thương hại! Người sẽ chết mất, nếu đám thanh niên già cỗi của Người không sớm hồi sinh.\n\n– 1925\n\n(Phụ lục Bản án chế độ thực dân Pháp, nguyên tác tiếng Pháp Le Procès de la Colonisation Francaise, Librairie du Travail, Paris 1925, bản dịch tiếng Việt của xnb Sự Thật, Hà Nội 1960)\n\nNguồn: http://www.talawas.org/talaDB/showFile.php?res=1569&amp;rb=0504\n",
  id: 4
});
console.log( jQuery.type(index) );

// Builds reference data (maybe not necessary for us, to check)
var store = [{
  "title": "How to use Google Analytics API",
  "author": null,
  "layout": "post",
  "link": "/blog/how-to-use-google-analytics-api",
}
,{
  "title": "Brazil bâng quơ",
  "author": null,
  "layout": "post",
  "link": "/life/brazil-co-don-truong-thanh",
}
,{
  "title": "Người lạ - Mai Thảo Yên",
  "author": null,
  "layout": "post",
  "link": "/life/nguoi-la-mai-thao-yen",
}
,{
  "title": "Upgrade flash chip on TP-Link from 4mb to 8mb",
  "author": null,
  "layout": "post",
  "link": "/openwrt/upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb",
}
,{
  "title": "Gửi thanh niên An Nam",
  "author": null,
  "layout": "post",
  "link": "/life/gui-thanh-nien-an-nam",
}
]

// Query
var qd = {}; // Gets values from the URL
location.search.substr(1).split("&").forEach(function(item) {
    var s = item.split("="),
        k = s[0],
        v = s[1] && decodeURIComponent(s[1]);
    (k in qd) ? qd[k].push(v) : qd[k] = [v]
});

function doSearch() {
  var resultdiv = $('#results');
  var query = $('input#search').val();

  // The search is then launched on the index built with Lunr
  var result = index.search(query);
  resultdiv.empty();
  if (result.length == 0) {
    resultdiv.append('<p class="">No results found.</p>');
  } else if (result.length == 1) {
    resultdiv.append('<p class="">Found '+result.length+' result</p>');
  } else {
    resultdiv.append('<p class="">Found '+result.length+' results</p>');
  }
  // Loop through, match, and add results
  for (var item in result) {
    var ref = result[item].ref;
    var searchitem = '<div class="result"><p><a href="'+store[ref].link+'?q='+query+'">'+store[ref].title+'</a></p></div>';
    resultdiv.append(searchitem);
  }
}

$(document).ready(function() {
  if (qd.q) {
    $('input#search').val(qd.q[0]);
    doSearch();
  }
  $('input#search').on('keyup', doSearch);
});
