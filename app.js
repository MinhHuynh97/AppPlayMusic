const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const KEY_LOCAL_STORAGE='APP_PLAY_MUSIC';
const heading =$('header h2');
const thumb=$('.cd-thumb');
const audio=$('#audio');
const cd=$('.cd');
const blockList=$('.playlist');
const btnPlay=$('.btn-toggle-play');
const player=$('.player');
const progress=$('#progress');
const btnNext=$('.btn-next');
const btnPrev=$('.btn-prev');
const btnRandom=$('.btn-random');
const btnRepeat=$('.btn-repeat');
const isTouch = 'touchstart' || 'mousedown';
const volumn=$('#volumn');
const app={
    currentIndex:0,
    listSong:[],
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(window.localStorage.getItem(KEY_LOCAL_STORAGE))||{},
    setConfig:function(key,value){
        this.config[key]=value;
        localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(this.config))
    },
    songs: [
        {
          name: "Dam Cuoi Nha",
          singer: "Hong Thanh_ DJ Mie",
          path: "./asset/music/Dam Cuoi Nha_ - Hong Thanh_ DJ Mie.mp3",
          image: "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/e/e/1/c/ee1c0fbea45998492524c8f3b5992ab4.jpg"
        },
        {
          name: "Ai Chung Tình Được Mãi",
          singer: "Đinh Tùng Huy, ACV",
          path: "./asset/music/Ai Chung Tinh Duoc Mai - Dinh Tung Huy.mp3",
          image:"https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/5/1/b/e/51be5970b57048f63d0159fc018b1dc3.jpg"
        },
        {
          name: "Không Trọn Vẹn Nữa",
          singer: "Châu Khải Phong, ACV",
          path:"./asset/music/Khong Tron Ven Nua - Chau Khai Phong_ AC.mp3",
          image: "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/7/d/7/c/7d7ccc9ef92fe30ab57543b978ab3548.jpg"
        },
        {
          name: "Muốn Em Là",
          singer: "Keyo",
          path: "./asset/music/Muon Em La - Keyo.mp3",
          image:"https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/7/4/0/9/7409e051f6f27cb8e6d241654ebb20d3.jpg"
        },
        {
          name: "Chạy Về Khóc Với Anh",
          singer: "ERIK",
          path: "./asset/music/Yeu Duong Kho Qua Thi Chay Ve Khoc Voi A.mp3",
          image:"https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/c/6/d/e/c6def069a1a885c41fe479358fa7c506.jpg"
        },
        
        {
          name: "Chạy Về Nơi Phía Anh",
          singer: "Khắc Việt",
          path: "./asset/music/Chay Ve Noi Phia Anh - Khac Viet.mp3",
          image:"https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/6/3/0/d/630d20b0a79917e1545b4e2ada081040.jpg"
        }
      ],
      playAudio:function(){
          
          
      },
    render:function(){
        
        var playList=this.songs.map((ele,index)=>{
            return `<div class="song ${index===this.currentIndex ?'active':''} "data-index='${index}'>
            <div class="thumb" style="background-image: url('${ele.image}')">
            </div>
            <div class="body">
            <h3 class="title">${ele.name}</h3>
            <p class="author">${ele.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        }).join('');
        blockList.innerHTML=playList;
    },
    definedProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent:function(){
        const _this=this;

        // Xu ly xoay CD
        const CdXoay=thumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
                duration:10000, //10s
                iterations:Infinity
        })
        CdXoay.pause();

        // Xu ly scroll
        var cdWidth=cd.offsetWidth;
        document.onscroll=function(){
            var scrollTop=window.scrollY || document.documentElement.scrollTop;
            var newscrollTop=cdWidth-scrollTop;
            if(newscrollTop<0){
                newscrollTop=0;
            }
            cd.style.width=newscrollTop +'px';
            cd.style.opacity=newscrollTop / cdWidth;
        }
        // Xu ly play
        btnPlay.onclick=function(){
            
            if(_this.isPlaying)
            {
                audio.pause();
                
            }
            else{
                audio.play();
                
            }
            
          }
        // Xu ly khi dang play
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add('playing');
            CdXoay.play();

        }
        // Xu ly khi bi pause
        audio.onpause=function(){
            _this.isPlaying=false;
            player.classList.remove('playing');
            CdXoay.pause();
        }

        // Xu ly khi audio chay
        audio.ontimeupdate=function(){
            if(audio.duration)
            {
            const progressUpdate=Math.floor(audio.currentTime/audio.duration*100);
            progress.value=progressUpdate;
            }
        }
        // Xu ly khi tua video den vi tri moi
        progress.oninput=function(e){
            const timeSkip=audio.duration/100*e.target.value;
            audio.currentTime=timeSkip;
        }
        

        // Xu ly next Song
        btnNext.onclick=function(){
            if(_this.isRandom)
            {
                _this.RandomSong();
            }else
            {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollOnTop();
            _this.setConfig('currentIndex',_this.currentIndex);
        };
        // Xu ly prev Song
        btnPrev.onclick=function(){
            if(_this.isRandom)
            {
                _this.RandomSong()
            }else
            {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollOnTop();
            _this.setConfig('currentIndex',_this.currentIndex);

        };
        // Xu ly khi random
        btnRandom.onclick=function(){
            if(_this.isRandom)
            {
                btnRandom.classList.remove('active');
                
                _this.isRandom=false;
            }else{
                btnRandom.classList.add('active');
                _this.isRandom=true;
            }
            _this.setConfig('isRandom',_this.isRandom);
        }
        // Xu ly khi ket thuc bai hat
        audio.onended=function(){
            if(_this.isRepeat)
            {
                audio.play();
            }
            else{
                btnNext.click()

            }
            _this.setConfig('currentIndex',_this.currentIndex);

        }
        // Xu ly khi bam vao repeat
        btnRepeat.onclick=function(){
            if(_this.isRepeat){
                btnRepeat.classList.remove('active');
                _this.isRepeat=false
            }else{
                btnRepeat.classList.add('active');
                _this.isRepeat=true

            }
            _this.setConfig('isRepeat',_this.isRepeat);

        }
        // Xu ly khi bam vao bai hat
        blockList.onclick=function(e){
            const nodeEle=e.target.closest('.song:not(.active)');
            if(nodeEle ||e.target.closest('.option') ){
                if(nodeEle)
                {
                    _this.currentIndex=Number(nodeEle.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if(e.target.closest('.option') )
                {
                    // code phan option
                }
            }
        }
        // Xu ly volumn cho audio
        volumn.oninput=function(){
            audio.volume=volumn.value/100;
            
        }
        

    },
    nextSong:function () {
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length)
        {
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong:function () {
        this.currentIndex--;
        if(this.currentIndex<0)
        {
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    scrollOnTop:function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center',
            })
        },300)
    }
    ,RandomSong:function () {
        let indexRandom;
        do{
            indexRandom=Math.floor(Math.random()*this.songs.length)
            
        }while(indexRandom==this.currentIndex)
        // console.log(indexRandom)
        this.listSong.push(indexRandom)
        this.currentIndex=indexRandom;
        this.loadCurrentSong();
    },loadConfig:function(){
        this.isRandom=this.config.isRandom;
        this.isRepeat=this.config.isRepeat;
        this.currentIndex=this.config.currentIndex;
    }
    ,
    loadCurrentSong:function(){
        
        heading.textContent=this.currentSong.name;
        thumb.style.backgroundImage=`url('${this.currentSong.image}')`;
        audio.src=this.currentSong.path;
    },
    start:function(){
        // Load config
        this.loadConfig()
        // Dinh nghia thuoc tinh cua Oject
        this.definedProperties()

        // Dinh nghia cac su kien cua DOM event
        this.handleEvent();


        this.loadCurrentSong();
        // Render tat ca cac bai hat
        this.render()

        //  Load lai repeat va random
        if(this.isRepeat)
        btnRepeat.classList.add('active')
        if(this.isRandom)
        btnRandom.classList.add('active')
        // btnRandom.classList.toggle('active',`${this.isRandom}`)
        
    }

}

app.start()



