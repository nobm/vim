<template>
    <button class="button" @click="count++">You clicked me {{ count }} times.</button>
</template>

<script>
module.exports = {
    data: function() {
        return {
            count: 0
        }
    }
}
</script>

<style scoped>
.button {
    color: green;
}
</style>