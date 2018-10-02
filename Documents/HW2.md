# Homework 1
# by. 이호중 2011171061

## 1. Write a short "interface review" for the a picture organizing software.

**Adobe Bridge**는 Adobe에서 제공하는 사진 정리 소프트웨어다. 포토샵과 어도비 프리미어와 같은 다른 Adobe 소프트웨어와 호환이 된다. 그리고 날짜별 정리뿐만 아니라 사진마다 커스텀 태그를 줄 수 있다. 모든 것을 한눈에 볼시 있게 창이 여러개로 나뉘어져있으며 유저가 원하는 대로 정렬할 수 있다.

## 2. Can the usage of the software be modeled as a sequence of decisions?

가능하다고 본다. 일반적으로 유저가 필요한 기능은 많으며 그것을 카타고리화 시켜 검색 시간을 줄일 수가 있다. 그리고 그 방법중하나가 Flow을 설계하는 것이고 이는 Decision Tree와 같이 순차적으로 접근을 하는 것이다. 물론 모든 것을 그렇게 만들면 너무 뎁스가 깊어지고 접근 시간이 늘어나기 때문에 병렬적으로 여러가 선택지를 동시에 제공하는 것도 좋다. 그래서 한 윈도우에서도 여러가지 서브 윈도우로 나뉘는 것이다.

## 3. Apply the GOMS methodology for a typical task as to be achieved by the software you chose above.

메뉴 클릭(1s) => 종료 클릭(1s) => 저장 클릭(1s) = 3초
실제 걸린 시간 = 2초

## 4. What is shown below is the recent Galax Note 9 from Samsung featuring the Bluetooth operated pen device.

펜 버튼 => 블루투스 전송 => 노트 인식 => 운영체제 반응