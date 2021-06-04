export class User {
    constructor(name, img_dir) {
        this.name = name;
        this.img_dir = img_dir;
    }
};

export class News {
    constructor(id,title,snippet,body){
        this.id = id;
        this.title = title;
        this.snippet = snippet;
        this.body = body;
    }
}

export class Updates {
    constructor(id,content,link){
        this.id = id;
        this.content = content;
        this.link = link
    }
}

export class Member {
    constructor(id,name,img,task) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.task = task;
    }
}