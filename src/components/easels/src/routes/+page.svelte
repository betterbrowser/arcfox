<script>
  import { onMount } from "svelte";
  /*
  // Arc Tools
  const tools = [
    { name: "selection", icon: "arrow_selector_tool" },
    { name: "image", icon: "image" },
    { name: "text", icon: "text_fields" },
    { name: "circle", icon: "circle" },
    { name: "square", icon: "square" },
    { name: "arrow", icon: "north_east" },
    { name: "draw", icon: "gesture" },
  ];
  */

  const tools = [
    { name: "selection", icon: "arrow_selector_tool" },
    { name: "text", icon: "text_fields" },
  ];
  var numberOfElements = 0;
  var toolSelected = tools[0].name;
  var mousePosition = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  var easelName = "";
  function createElement() {
    const canvas = document.querySelector("div#canvas");
    if (toolSelected == "text" && !document.activeElement.matches("input")) {
      const element = document.createElement("input");
      element.style = `position: fixed; left: ${mousePosition[1].x - 10}px; top: ${mousePosition[1].y - 25}px;`;
      element.id = "inp" + String(numberOfElements);
      element.placeholder = "Type anything...";
      canvas.appendChild(element);
      element.focus();
      console.log("New element created!");
      toolSelected = "selection";
      document.body.style.cursor = "default";
    }
  }
  function deleteElement() {
    var element = document.activeElement;
    const canvas = document.querySelector("div#canvas");
    if (element.matches(":hover")) {
      canvas.removeChild(element);
    }
  }
  onMount(() => {
    console.log("New Easel created");
    const canvas = document.querySelector("div#canvas");
    canvas.addEventListener("mouseup", (e) => {
      mousePosition[1] = { x: e.pageX, y: e.pageY };
      createElement();
    });
    document.body.addEventListener("mouseup", (e) => {
      if (e.which == 2) {
        deleteElement();
      }
    });
  });
</script>

<title>{easelName == "" ? "New Easel" : easelName}</title>
<div id="canvas">
  <input
    style="font-size: 25px; margin-top: 20px; font-weight: 800; text-align: center; position: absolute; transform: translateX(calc(50vw - 200px))"
    placeholder="New Easel"
    bind:value={easelName}
  />
</div>
<div id="toolbar">
  {#each tools as tool}
    <button
      id={toolSelected == tool.name ? "selected" : "unselected"}
      on:click={() => {
        toolSelected = tool.name;
        if (toolSelected == "text") {
          document.body.style.cursor = "text";
        } else {
          document.body.style.cursor = "default";
        }
      }}
      class="tbbutton">{tool.icon}</button
    >
  {/each}
  <button class="tbbutton">ios_share</button>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");
  :root {
    --primaryColor: rgb(64, 70, 133);
    --primaryContainerColor: rgba(111, 88, 155, 0.2);
    &::selection {
      color: var(--primaryColor);
      background: var(--primaryContainerColor);
    }
  }

  div#toolbar {
    position: fixed;
    z-index: 10;
    border-radius: 10px;
    user-select: none;
    bottom: 12px;
    left: 12px;
    background: white;
    padding: 5px;
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.212);
    & button.tbbutton {
      font-family: Material Symbols Outlined;
      font-size: 18px;
      height: 35px;
      background: transparent;
      border-radius: 8px;
      border: 0;
      cursor: pointer;
      width: 35px;
      transition: 0.1s;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      &:active {
        scale: 0.9;
      }
      &#selected {
        background: var(--primaryColor);
        color: white;
      }
    }
  }
  div#canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    & input {
      background: transparent;
      font-size: 20px;
      border: 4px solid transparent;
      border-radius: 10px;
      padding: 10px;
      transition: border 0.2s;
      resize: both;
      &::selection {
        color: var(--primaryColor);
        background: var(--primaryContainerColor);
      }
      &:focus {
        outline: 0;
        border: 4px solid var(--primaryColor);
      }
    }
  }
</style>
