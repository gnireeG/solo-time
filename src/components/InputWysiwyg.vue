<template>
    <div class="q-gutter-sm">
        <q-editor
        v-model="content"
        :dense="$q.screen.lt.md"
        :toolbar="[
            [
            'bold', 'italic', 'underline', 'strikethrough', 'link'
            ],
            [
            {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: [
                'p',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'code'
                ]
            },
            {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
                ]
            },
            ],
            ['unordered', 'ordered'],

            ['undo', 'redo'],
            ['viewsource', 'fullscreen']
        ]"
        :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
        }"
        />
    </div>
</template>

<script setup lang="ts">
const content = defineModel<string>({ default: '' })
</script>
