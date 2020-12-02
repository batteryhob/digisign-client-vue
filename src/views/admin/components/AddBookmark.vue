<template>
  <div id="popup" :class="{ off: !bookmarkPopup }">
    <div class="wrapper">
      <div class="container">
          <div class="header">
            <i class="fas fa-plus"></i>Add Bookmark
          </div>
          <div class="body">
            <div class="input">
              <div class="flex">
                <input type="text" v-model="text" v-on:keyup.enter="onEnter" maxlength="15">
                <button @click="addBookmark">Add</button>
                <button @click="cancel">Cancel</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddBookmark',
  props: {
    bookmarkPopup: Boolean
  },
  sockets: {
  },
  methods: {
    addBookmark() {
      this.$parent.customButtons.push(this.$data.text);
      this.$data.text = "";
    },
    cancel() {
      this.$data.text = "";
      this.$parent.bookmarkPopup = false;
    },
    onEnter(){
      this.addBookmark();
    }
  },
  data(){
    return{
      text: ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  $color-fontgray: #73797d;
  $color-linegray: #363d45;
  $color-bordergray: #e9ecef;
  $color-bodygray: #eff5f7;

  #popup {
      position: fixed;
      z-index: 9998;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
      display: table;

      &.off {
          visibility: hidden;
      }

      .wrapper {
          display: table-cell;
          vertical-align: middle;            
          .container {
            position: relative;
            width: 400px;
            margin: 0px auto;
            background-color: $color-bodygray;
            color: $color-fontgray;
            .header {
                font-size: 14px;
                padding: 10px 10px;
                border-bottom: 1px solid $color-bordergray;
                i{
                  margin-right: 5px;
                }
            }
            .body {
              .input {
                padding: 15px;
                background-color: #fff;
                border-top: 1px solid $color-bordergray;
                .flex{
                  display: flex;
                  input {
                    flex: 5;
                    font-family: "Noto Sans KR";
                    font-size: 14px;
                    border: none;
                    outline: none;
                    border-bottom: 1px solid $color-bordergray;
                  }
                  button {
                    flex: 1;        
                    margin-left: 5px;
                    background-color: $color-fontgray;
                    font-family: "Noto Sans KR";
                    font-size: 14px;                    
                    color: #fff;                    
                    border: none;
                    outline: none;
                    text-decoration: none;
                    &:hover{
                        background-color: #ccc;
                    }
                  }
                }
              }
            }
          }            
      }
  }

</style>
