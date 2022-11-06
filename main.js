'use strict'

function randnum(low, up) {
    return Math.random() * (up - low) + low
}

let timesUp = 3;
let powerTime = 250;
let player1;
let player2;
let aDrops = [];

function bfrStart() {
    msg.start();
    title.start();
    startBtn.start();
    hzRule.start();
    instrucBtn.start();
    instruction.start();
    canvasDiv.start();
    myBG.bfrStart();
    $("#instruction").hide();
    showIns();
}

function startGame() {
    score1.start();
    score2.start();
    $(".bfrStart").hide();
    myBG.start();
    madeDrops();
    player1 = new createPlayer(40, -1);
    player2 = new createPlayer(40, 1);
}

var msg = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("id", "message");
        container.insertBefore(this.div, container.childNodes[0]);
        this.div.innerHTML = '';
    },
    over: function(t) {
        if (t) {
            this.div.style.padding = "191px 0 0 0 ";
        } else {
            this.div.style.padding = "154px 0 0 0 ";
        }
    }
}

var title = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("id", "title")
        this.div.setAttribute("class", "bfrStart");
        document.getElementById("message").appendChild(this.div);
        this.div.innerHTML = "Ball Catching";
    }
}

var startBtn = {
    btn: document.createElement("button"),
    start: function() {
        this.btn.setAttribute("id", "startBtn");
        this.btn.setAttribute("class", "bfrStart");
        document.getElementById("message").appendChild(this.btn);
        this.btn.innerHTML = "Start";
        this.btn.addEventListener("click", startGame);
        this.btn.removeEventListener
    }
}

var instrucBtn = {
    btn: document.createElement("button"),
    start: function() {
        this.btn.setAttribute("id", "instrucBtn")
        this.btn.setAttribute("class", "bfrStart");
        document.getElementById("message").appendChild(this.btn);
        this.btn.innerHTML = "How to play?";
    }
}

var instruction = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("id", "instruction");
        this.div.setAttribute("class", "bfrStart");
        document.getElementById("message").appendChild(this.div);
        this.div.innerHTML = '雙人遊戲，玩家一為遊戲開始後之右方方塊，以上、左右鍵操控，玩家二為左方方塊，以W、AD鍵操控。<br><br>球分三類，掉落球若為<span id="badBall">此顏色</span>，則為壞球，碰到則遊戲結束，若為彩色則可加分，若為閃爍之彩色球則可使自身得到Bonus。<br><br><span id="caution">注意：</span>就算為Bonus狀態，仍無法碰觸壞球。';
    }
}

var hzRule = {
    hr: document.createElement("hr"),
    start: function() {
        document.getElementById("message").appendChild(this.hr);
    }
}

function showIns() {
    $(document).ready(function() {
        $("#instrucBtn").click(function() {
            $("#instruction").fadeToggle();
        });
    });
}

var container = document.getElementById("container");

var canvasDiv = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("id", "canvasDiv");
        container.insertBefore(this.div, container.childNodes[1]);
    }
}

var myBG = {
    canvas: document.createElement("canvas"),
    bfrStart: function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        canvasDiv.div.appendChild(this.canvas);
    },
    start: function() {
        this.interval = setInterval(updateBG, 20);
        this.timer = 0;
        window.addEventListener("keydown", move, false);
        window.addEventListener("keyup", stop, false);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    over: function() {
        clearInterval(this.interval);
        if (myBG.timer >= timesUp) {
            msg.over(true);
            document.getElementById("message").innerHTML = "Time's Up";
            score1.won(player1.myScore > player2.myScore);
        } else {
            msg.over(false);
            if (!player1.life) {
                document.getElementById("message").innerHTML = 'Game Over <br><span id="player1"> PlayerI</span> loose';
                document.getElementById("player1").style.color = player1.iniColor; //span id 重設 不搶色
            } else if (!player2.life) {
                document.getElementById("message").innerHTML = 'Game Over <br> <span id="player2"> PlayerII</span> loose';
                document.getElementById("player2").style.color = player2.iniColor;
            }
        }
        restartGame();
    }
}

var score1 = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("class", "score");
        container.insertBefore(this.div, container.childNodes[2]);
        scoreStyle(this.div);
    },
    update: function() {
        this.div.innerHTML = '<span id="score1">' + "P1" + "</span>" + "'s Score: " + player1.myScore;
        document.getElementById("score1").style.color = player1.iniColor;
    },
    won: function(b) {
        if (b) {
            this.div.style.color = "rgb(255, 209, 124)";
            this.div.style.fontSize = "32px";
        } else if (!b) {
            if (player1.myScore < player2.myScore) {
                score2.won();
            }
        }
    }
}

var score2 = {
    div: document.createElement("div"),
    start: function() {
        this.div.setAttribute("class", "score");
        container.insertBefore(this.div, container.childNodes[3]);
        scoreStyle(this.div);
    },
    update: function() {
        this.div.innerHTML = '<span id="score2">' + "P2" + "</span>" + "'s Score: " + player2.myScore;
        document.getElementById("score2").style.color = player2.iniColor;
    },
    won: function() {
        this.div.style.color = "rgb(255, 209, 124)";
        this.div.style.fontSize = "32px";
    }
}

function scoreStyle(board) {
    board.style.height = "1.3em";
    board.style.color = "white";
    board.style.fontSize = "28px";
}

class createItem {
    constructor(radius, x, kind, bonus) {
        this.exist = true;
        this.kind = kind; //true means add score
        this.bonus = bonus;
        this.radius = radius;
        this.x = x;
        this.y = this.radius + 10;
        this.width = 2 * radius;
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
        this.top = this.y - this.radius;
        this.bottom = this.y + radius;
        this.color = "rgb(" + randnum(155, 255) + "," + randnum(155, 255) + "," + randnum(155, 255) + ")";
        this.g = randnum(0.2, 0.4);
        this.speedG = 0;
        this.CoR = randnum(0.7, 0.85);
        this.bouTimes = 0;
        this.ground = myBG.canvas.height - this.radius - 10;
    }
    update() {
        if (!this.kind && this.bonus) {
            this.bonus = 0; //bad bonus -> bad
        }
        if (this.bonus && this.exist) {
            this.color = "rgb(" + randnum(125, 255) + "," + randnum(125, 255) + "," + randnum(125, 255) + ")";
            if (this.bonus) {
                this.g = 0.5;
            }
        }
        if (!this.kind) {
            this.color = "rgb(80,80,80)";
        }
        let ctx = myBG.context;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
    };
    position() {
        this.speedG += this.g;
        this.y += this.speedG;
        if (!this.exist) {
            this.speedG = 0;
            this.y = this.ground + this.width;
        }
        if (this.y < 0 && this.bouTimes >= 4) {
            this.exist = false;
        }
        if (this.y > this.ground) {
            this.y = this.ground;
            this.speedG = -(this.speedG * this.CoR);
            if (this.bonus && this.exist) {
                this.CoR *= 1.4
                this.g += 0.4;
            }
            if (this.bouTimes < 100) {
                this.bouTimes++;
            }
        }
    };
}

class createPlayer {
    constructor(width, n) {
        this.power = 1;
        this.life = true;
        this.width = width;
        this.height = width;
        this.YonGround = myBG.canvas.height - this.height - 10;
        this.x = myBG.canvas.width / 2 - width / 2 - this.width * n;
        this.y = this.YonGround;
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.width;
        this.color = "rgb(" + randnum(55, 255) + "," + randnum(55, 255) + "," + randnum(55, 255) + ")";
        this.iniColor = this.color;
        this.g = 0.3;
        this.speedG = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.timer = powerTime;
        this.myScore = 0;
        this.colliSpeed = 5;
        this.dCSpeed = 0;
        this.a = 0.5;
        this.direct = 1;
        this.colliPlayer = false;
        this.hitMargin = false;
    }
    update() {
        if (this.power > 1) {
            this.color = "rgb(" + randnum(125, 255) + "," + randnum(125, 255) + "," + randnum(125, 255) + ")";
        }
        let ctx = myBG.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.left = this.x
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.width;
    };
    position() {
        this.x += this.speedX * this.power;
        this.y += this.speedY;
    };
    jump() {
        this.speedY = -6 * this.power;
        this.speedY += this.speedG;
        this.speedG += this.g;
        if (this.speedY >= 6 * this.power) {
            this.y = this.YonGround - this.speedY;
            this.speedG = 0;
            this.moveUp = false;
        }
    };
    crash(o) {
        return !((this.left > o.right) || (this.right < o.left) || (this.top > o.bottom) || (this.bottom < o.top));
    };
    powerMode(t) {
        if (t < powerTime) {
            this.power = 1.5;
            this.colliPlayer = false;
        } else {
            this.power = 1;
            this.color = this.iniColor;
        }
    };
    collision() {
        this.speedX = this.colliSpeed * this.direct;
        this.speedX += this.dCSpeed;
        this.dCSpeed -= this.a * this.direct;
        if (Math.abs(this.speedX) < 1) {
            this.speedX = 0;
            this.dCSpeed = 0;
            this.direct = 1;
            this.colliPlayer = false;
            this.colliSpeed = 5;
        }
    };
    hitWall() {
        if (this.left < 0) {
            this.x = 0;
            this.hitMargin = true;
        } else if (this.right > myBG.canvas.width) {
            this.x = myBG.canvas.width - this.width;
            this.hitMargin = true;
        } else {
            this.hitMargin = false;
        }
    }
}

function move(e) {
    e = e || window.event;
    switch (e.code) {
        case "ArrowLeft":
            player1.moveLeft = true;
            break;
        case "ArrowRight":
            player1.moveRight = true;
            break;
        case "ArrowUp":
            player1.moveUp = true;
            break;
        case "KeyA":
            player2.moveLeft = true;
            break;
        case "KeyD":
            player2.moveRight = true;
            break;
        case "KeyW":
            player2.moveUp = true;
            break;
    }
}

function stop(e) {
    e = e || window.event;
    switch (e.code) {
        case "ArrowLeft":
            player1.moveLeft = false;
            break;
        case "ArrowRight":
            player1.moveRight = false;
            break;
        case "KeyA":
            player2.moveLeft = false;
            break;
        case "KeyD":
            player2.moveRight = false;
            break;
    }
}

function craDrops(player) {
    for (let i = 0; i < aDrops.length; i++) {
        if (player.crash(aDrops[i]) && aDrops[i].exist) {
            if (!aDrops[i].kind) {
                player.life = false;
                myBG.over();
            } else if (aDrops[i].kind) {
                aDrops[i].exist = false;
                player.myScore++;
                if (aDrops[i].bonus) {
                    player.timer = 0;
                    player.myScore--;
                }
            }
        }
    }
}

function craPlayers(me, another) {
    let gap = 2;
    let disX = me.x >= another.x; //flaw: player1 will always move right if overlaid each other
    if (me.crash(another)) {
        if (me.timer > powerTime && (me.left > 0 && me.right < myBG.canvas.width)) {
            if (another.timer < powerTime) {
                me.colliSpeed = 10;
            }
            me.colliPlayer = true;
        }
        if (disX) {
            me.x += gap;
        } else if (!disX) {
            me.direct = -1;
            me.x += -gap;
        }
    }
}

function updateBG() {
    if (myBG.timer >= timesUp) {
        myBG.over();
    }
    craDrops(player1);
    craDrops(player2);
    craPlayers(player1, player2);
    craPlayers(player2, player1);
    myBG.clear();
    player1.position();
    player1.speedX = 0;
    player1.speedY = 0;
    player2.position();
    player2.speedX = 0;
    player2.speedY = 0;
    if (player1.colliPlayer && !player2.hitMargin) {
        player1.collision();
    }
    if (player2.colliPlayer && !player1.hitMargin) {
        player2.collision();
    }
    if (player1.moveLeft && player1.x > 0 && !player1.crash(player2) && !player1.colliPlayer) {
        player1.speedX = -5;
    }
    if (player1.moveRight && player1.x + player1.width < myBG.canvas.width && !player1.crash(player2) && !player1.colliPlayer) {
        player1.speedX = 5;
    }
    if (player1.moveUp) {
        player1.jump();
    }
    if (player2.moveLeft && player2.x > 0 && !player2.crash(player1) && !player2.colliPlayer) {
        player2.speedX = -5;
    }
    if (player2.moveRight && player2.x + player2.width < myBG.canvas.width && !player2.crash(player1) && !player2.colliPlayer) {
        player2.speedX = 5;
    }
    if (player2.moveUp) {
        player2.jump();
    }
    for (let i = 0; i < aDrops.length; i++) {
        aDrops[i].position();
        if (aDrops[i].exist) {
            aDrops[i].update();
        }
    }
    player1.hitWall();
    player2.hitWall();
    player1.update();
    player2.update();
    score1.update();
    score2.update();
    wave();
    player1.timer++;
    player1.powerMode(player1.timer);
    player2.timer++;
    player2.powerMode(player2.timer);
}

function wave() {
    let onGround = 0;
    for (let i = 0; i < aDrops.length; i++) {
        if (aDrops[i].y == aDrops[i].ground && aDrops[i].bouTimes > 50) { //stay on ground
            onGround++;
        } else if (!aDrops[i].exist) {
            onGround++;
        }
    }
    if (onGround == aDrops.length) {
        for (let i = 0; i < aDrops.length; i++) {
            aDrops[i].exist = false;
        }
        myBG.timer++;
        if (myBG.timer < timesUp) {
            madeDrops();
        }
    }
}

function madeDrops() {
    let drops = Math.floor(randnum(3, 6));
    for (let i = 0; i < drops; i++) {
        aDrops.push(new createItem(randnum(10, 20), randnum(10, myBG.canvas.width - 10), Math.floor(randnum(0, 2)), Math.floor(randnum(0, 1.25))));
    }
}

function restartGame() {
    setTimeout(function() {
        var restart = confirm('Do you want to play again?');
        if (restart) {
            for (let i = 0; i < aDrops.length; i++) {
                aDrops[i].exist = false;
            }
            bfrStart();
            startGame();
        }
    }, 1500)
}