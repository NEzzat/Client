<template>
    <div class="alert alert-success alert-dismissible" role="alert">
        <slot>test alert</slot>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isVisible: true
        }
    },
    created: function () {
      
    },
}
</script>

<style>

</style>