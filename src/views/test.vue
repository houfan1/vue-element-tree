<template>
  <div class="test">
    <div class="left">
      <el-form :inline="true" :model="form" size="mini">
        <el-form-item label="菜单名称">
          <el-input
            v-model.trim="form.addData"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input
            v-model.trim="form.addurl"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newData()">添加</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
        :draggable="true"
        :props="defaultProps"
        :allow-drop="allowDropCheck"
      >
      </el-tree>
      <el-button @click="clickBtn()">数据打印在控制台</el-button>
    </div>
    <div class="right">
      <el-table
        ref="multipleTable"
        :data="store"
        tooltip-effect="dark"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="菜单类型" prop="name">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.url">链接型菜单</span>
              <span v-if="!scope.row.url">文字型菜单</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot="header">
            <el-button size="mini" @click="addAll()">添加</el-button>
          </template>

          <template slot-scope="scope">
            <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">
              添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { id: "1", name: "菜单一", url: "caidan1", children: [] },
        {
          id: "2",
          name: "菜单二",
          url: "",
          children: [
            { id: "2-1", name: "菜单2-1", url: "caidan2-1", children: [] },
            { id: "2-2", name: "菜单2-2", url: "caidan2-2", children: [] }
          ]
        },
        {
          id: "3",
          name: "菜单三",
          url: "",
          children: [
            { id: "3-1", name: "菜单3-1", url: "caidan3-1", children: [] },
            { id: "3-2", name: "菜单3-2", url: "caidan3-2", children: [] }
          ]
        }
      ],
      defaultProps: {
        label: "name",
        id: "id",
        children: "children"
      },
      store: [],
      multipleSelection: [],

      form: {
        addData: "",
        addurl: ""
      }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addAll() {
      // 将选中数据添加值左侧树数据中，并将仓库数据和选中数据进行比对删除
      this.data.push(...this.multipleSelection);
      let store = this.store;
      let multipleSelection = this.multipleSelection;
      for (let i = 0; i < multipleSelection.length; i++) {
        const index = store.findIndex(
          d => d.name === multipleSelection[i].name
        );
        store.splice(index, 1);
      }
      this.store = store;
      // this.multipleSelection = [];
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.name === data.name);

      let arr = [];
      let list = data.children;
      if (data.children && list.length != 0) {
        arr.push(...list);
        data.children = [];
      }
      arr.push(data);
      this.store.push(...arr);
      children.splice(index, 1);
    },
    renderContent(h, { node, data }) {
      let sign = "";
      if (data.url) {
        sign = "链接型菜单";
      } else {
        sign = "文字菜单";
      }
      return (
        <div class="custom-tree-node" style="width:100%">
          <el-row>
            <el-col span={12}>
              <span>{node.label}</span>
            </el-col>

            <el-col span={12}>
              <span style="color:red;display:inline-block;width:100px;">
                {sign}
              </span>
              <span>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.edit(node, data)}
                >
                  修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.remove(node, data)}
                >
                  移除
                </el-button>
              </span>
            </el-col>
          </el-row>
        </div>
      );
    },
    // eslint-disable-next-line no-unused-vars
    allowDropCheck(draggingNode, dropNode, type) {
      // 此处判断正在拖动的菜单是否可以放入该位置
      // 目前我进行的判断是 文字型菜单下可以包含链接型菜单，但是链接型菜单下不能包含其他菜单，可以根据需要进行适当调整
      if (dropNode.data.url) {
       return type !== "inner";
      } else {
        return true;
      }
    },
    edit(node, data) {
      this.$prompt("请输入名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputPattern: /^.{1,10}$/,
        inputErrorMessage: "请输入1-10位字符"
      })
        .then(({ value }) => {
          if (this.checkHasSameName(value)) {
            // 在修改数据时候，遍历所有菜单和children确保name保持唯一性，如果有其他方式验证则不需要此步骤
            this.$message.error("已有相同的菜单名称");
            return;
          }
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.name === data.name);
          children[index].name = value;
        })
        .catch(() => {
          return false;
        });
    },

    clickBtn() {
      console.log(this.data);
    },
    newData() {
      if (this.form.addData) {
        if (this.checkHasSameName(this.form.addData)) {
          // 在创建新的数据时候，遍历所有菜单和children确保name保持唯一性，如果有其他方式验证则不需要此步骤
          this.$message.error("已有相同的菜单名称");
          return;
        }
        this.data.push({
          name: this.form.addData,
          url: this.form.addurl ? this.form.addurl : null,
          children: []
        });
        this.form.addData = "";
        this.form.addurl = "";
      }
    },
    handleAdd(index, row) {
      this.data.push(row);
      let i = index;
      this.store.splice(i, 1);
    },

    checkHasSameName(name) {
      //遍历并验证是否含有相同名称的菜单
      let arr = [];
      const pushArrList = list => {
        list.forEach(ele => {
          arr.push(ele);
          if (ele.children) {
            pushArrList(ele.children);
          } else {
            arr.push(ele);
          }
        });
      };
      pushArrList(this.data);

      let state = arr.some(ele => {
        return ele.name == name;
      });

      return state;
    }
  }
};
</script>


<style lang="less" scope>
.test {
  display: flex;
  padding: 10px;
  .right,
  .left {
    width: 50%;
    margin: 20px;
    padding: 20px 30px;
    border: 1px solid #333;
  }
}
</style>