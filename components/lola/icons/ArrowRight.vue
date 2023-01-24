<template>
  <svg
    data-v-4d3f71d8=""
    xmlns="http://www.w3.org/2000/svg"
    width="31.043"
    height="7.666"
    viewBox="0 0 31.043 7.666"
    :stroke="stroke"
  >
    <g
      id="Group_1364"
      data-v-4d3f71d8=""
      data-name="Group 1364"
      transform="translate(0.5 0.5)"
    >
      <g id="Group_1315" data-v-4d3f71d8="" data-name="Group 1315">
        <path
          id="Path_445"
          data-v-4d3f71d8=""
          data-name="Path 445"
          d="M9.939,88.519,6.814,85.394a.208.208,0,0,0-.295.295l2.769,2.769h-29.08a.208.208,0,0,0-.208.208.208.208,0,0,0,.208.208H9.288L6.519,91.644a.208.208,0,1,0,.295.295l3.125-3.125A.208.208,0,0,0,9.939,88.519Z"
          transform="translate(20 -85.333)"
          :fill="color"
          stroke-width="1"
        ></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#514945'
    },
    stroke: {
      type: String,
      default: 'none'
    }
  }
}
</script>
