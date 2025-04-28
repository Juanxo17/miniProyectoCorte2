export class Stack  {
    constructor(){
        this.items = [];
    }

    push(value){
        this.items.push(value);
    }

    pop(){
        return this.items.length > 0 ? this.items.pop() : null;
    }
    peek(){
        return this.items.length > 0 ? this.items[this.items.length-1] : null;
    }

    size(){
        return this.items.length;
    }

    print(){
        this.items.slice().reverse().forEach(item =>{
            console.log(item);
        })
    }
}


