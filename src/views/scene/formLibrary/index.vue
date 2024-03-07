<!-- /form-library/index -->
<!-- 现场作业 -> 表单作业 -->
<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
	</div>
</template>

<script>
export default {
  beforeCreate() {
		window.open(this.$API + `/form/form/index`, '_blank')
		this.$router.back()
  }
}
</script>
