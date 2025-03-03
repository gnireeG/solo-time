<template>
    <q-page>
        <h3 v-if="client">{{ client.name }}</h3>
        <form v-if="client" @submit.prevent.stop="onSubmit">
            <q-input v-model="client.name" label="Name" />
            <q-btn label="Save" type="submit" color="primary" value="Save" />
        </form>
        <q-separator class="q-my-lg" />
        <q-tabs v-model="tab" align="left">
            <q-tab name="projects" :label="'Projects ('+projects.length+')'" />
            <q-tab v-if="client" name="contacts" :label="'Contacts ('+client.contacts.length+')'" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="projects">
                <ProjectsTable :projects="projects" :defaultClientId="id" />
            </q-tab-panel>
            <q-tab-panel name="contacts">
                <q-table v-if="client" :rows="client.contacts">
                    <template v-slot:top>
                        <div class="row justify-end w-full">
                            <q-btn label="New" color="primary" @click="showNewContactDialog = true" />
                        </div>
                    </template>
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td>{{ props.row.name }}</q-td>
                            <q-td><a class="text-link" :href="'mailto:'+props.row.email">{{ props.row.email }}</a></q-td>
                            <q-td><a class="text-link" :href="'tel:'+props.row.phone">{{ props.row.phone }}</a></q-td>
                            <q-td><a class="text-link" :href="props.row.website" target="_blank">{{ props.row.website }}</a></q-td>
                            <q-td>{{ props.row.description }}</q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-tab-panel>
        </q-tab-panels>
        <q-dialog v-model="showNewContactDialog">
            <q-card>
                <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add new contact</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <form @submit.prevent.stop="onSubmitNewContact">
                        <div class="row q-gutter-md">
                            <div>
                                <q-input v-model="newClientForm.name" label="Name" tabindex="1" />
                                <q-input v-model="newClientForm.phone" label="Phone" type="tel" tabindex="3" />
                            </div>
                            <div>
                                <q-input v-model="newClientForm.email" label="Email" type="email" tabindex="2" />
                                <q-input v-model="newClientForm.website" label="Website" tabindex="4" />
                            </div>
                        </div>
                        <q-input v-model="newClientForm.description" label="Description" type="textarea" tabindex="5" />
                        <q-separator class="q-my-md" />
                        <div class="row w-full justify-end q-gutter-md">
                            <q-btn label="Cancel" color="secondary" @click="clearAndCloseDialog()" />
                            <q-btn label="Submit" type="submit" color="primary" />
                        </div>
                    </form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDBStore } from 'src/stores/db-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import type { Client } from 'src/models/Client';

import ProjectsTable from 'src/components/ProjectsTable.vue';

const $q = useQuasar();

const router = useRouter();
const idParam = router.currentRoute.value.params.id;
const id = idParam ? parseInt(idParam as string) : NaN;
const db = useDBStore();

const showNewContactDialog = ref(false);

const newClientForm = ref({
    name: '',
    email: '',
    phone: '',
    website: '',
    description: ''
});

async function onSubmitNewContact() {
    if (!client.value) return;
    const updatedContacts = [
        ...client.value.contacts,
        { ...newClientForm.value }
    ];
    console.log({
        ...client.value,
        contacts: updatedContacts
    });
    if (!client.value.id) return;
    await db.updateClient({
        ...client.value,
        contacts: JSON.parse(JSON.stringify(updatedContacts)) // Ensure contacts are serializable
    });
    fetchClientFromStore();
    clearAndCloseDialog();
}

const tab = ref<string>('projects');

const client = ref<Client | undefined>(undefined);

const projects = computed(() => db.projects.filter(p => p.clientId == id));

onMounted(() => {
    fetchClientFromStore();
});

function fetchClientFromStore() {
    client.value = db.clients.find(c => c.id === id);
}

async function onSubmit(): Promise<void> {
    if (!client.value) return;
    await db.updateClient({ name: client.value.name, id: client.value.id } as Client);
    fetchClientFromStore();
    $q.notify({
        message: 'Client saved',
        color: 'positive',
        position: 'bottom-right',
        icon: 'check'
    })
}

function clearForm() {
    newClientForm.value = {
        name: '',
        email: '',
        phone: '',
        website: '',
        description: ''
    };
}

function clearAndCloseDialog() {
    clearForm();
    showNewContactDialog.value = false;
}
</script>