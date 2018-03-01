# else

ejs 성능개선 Framwork 입니다.

**UI else Framwork**: UI preview가 불필요하므로, preview URL이 존재하지 않습니다.

[Gulp](http://gulpjs.com/)와 [ejs](https://github.com/mde/ejs) 템플릿 엔진을 
기반으로한 UI 프레임워크 입니다.

본 프로젝트는 ui/book-desktop 에서 main 페이지만 뽑아서 프로젝트를 생성했으며, 
동일한 형식으로 제작된 각 프로젝트의 프레임워크에 공통적인 문제 해결과 개선 방법의
일관성을 이루기 위해 생성하였습니다.

신규로 생성하는 프로젝트는 if 를 사용해주시고, 만약 if 를 사용할 수 없는 환경이라면
else 를 사용해주시기 바랍니다.

else 로 제작하려는 신규 프로젝트는 본 저장소를 upstream 으로 추가하여 최신 변경사항이 
싱크될 수 있도록 합니다.

- 참고: [SourceTree 에서 upstream 추가하기](http://blog.eeearl.com/2016-02-19-add-upstream-at-fork-repository/)
  
## 설치

1. [Node.js](https://nodejs.org/en/) LTS 버전 설치
1. 프로젝트 clone 후 npm 디펜던시 인스톨 `$ npm i`
1. `$ npm start` 명령어를 입력하여 소스 빌드 & 웹서버 시작
