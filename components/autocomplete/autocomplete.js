// components/autocomplete/autocomplete.js

Component({
  //behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: 'static'/**2种类型 static （必填source）， remote（必填sourceUrl） */
    },
    source: {
      type: Array,
      value: null,/**JSON对象数组，格式{id:1,value:'',sort:1,selected:false} */
      observer: '_sourceChanged'
    },
    sourceUrl: String,/**远程接口响应的data数据为JsonArray:[{id:1,value:''}] */
    keyword: String,/**远程接口查询数据源关键字，以get请求带上keyword参数 */
    placeholderText: String,
    selectedId:String
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function () {
    /**根据属性selected value 选择item */    
    if (this.data.mode === 'static') {
        var copys = this.data.source
        if (this.data.selectedId) { 
          for (var i in copys) {
            if (copys[i].id === this.data.selectedId) {
              copys[i]['selected'] = true
              this.setData({ selectedItem: copys[i] })
              break
            }
          }
        } 
    } else if (this.data.mode = 'remote') {
      var that = this 
      var oldHolderText = this.data.placeholderText
      that.setData({ placeholderText: '数据源加载中...' })      
      wx.request({
        url: that.data.sourceUrl,
        data: { keyword: that.data.keyword },
        success: function (res) {
           
          that.setData({ source: res.data })          
          var copys = that.data.source

          if (that.data.selectedId) {
            for (var i in copys) {
              if (copys[i].id === that.data.selectedId) {
                copys[i]['selected'] = true
                that.setData({ selectedItem: copys[i] })
                break
              }
            }
          } 
          that.setData({ placeholderText: oldHolderText })
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _sourceChanged: function (newVal, oldVal) {
      this.setData({ source: this.data.source })
    },
    showScroll: function () {
      this.setData({ showScroll: true })
    },
    inputfocus: function (e) {

    },
    itemSelected: function (e) {
      var selectedIdx = e.currentTarget.dataset.index
      var copys = this.data.source
      for (var i in copys) {
        if (i == selectedIdx ) {
          copys[i].selected = true
        }else{
          copys[i].selected = false
        }
      }
      var myEventDetail = copys[selectedIdx]
      var myEventOption = {}
      this.setData({ selectedItem: copys[selectedIdx], showScroll: false })
      this.triggerEvent('item-selected', myEventDetail, myEventOption)
    },
    inputed: function (e) {
      var inputVal = e.detail.value
      var copySource = this.data.source
      for (var i in copySource) {
        var value = copySource[i].value
        var idx = value.indexOf(inputVal)
        if (idx != -1) {
          copySource[i]['sort'] = (i + 1) * 100 + idx
        } else {
          copySource[i]['sort'] = i
        }
      }
      copySource.sort(function (a, b) { return b.sort - a.sort })
      this.setData({ source: copySource, toView: 'to_view_' + copySource[0].id })
    },
    maskClick: function () {
      var copys = this.data.source
      for (var i in copys) {
        if (copys[i].selected) {
          this.setData({ selectedItem: copys[i] })
          break
        }
      }     
      this.setData({ showScroll: false })
      var myEventDetail = this.data.selectedItem
      var myEventOption = {}
      this.triggerEvent('item-selected', myEventDetail, myEventOption)
    }
  }
})
