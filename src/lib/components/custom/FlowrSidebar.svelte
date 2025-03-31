<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";
    const sidebar = useSidebar();
</script>


<Sidebar.Root side='left' variant='floating' collapsible='icon'>
    
    <Sidebar.Content class='pt-12'>
        <Sidebar.Trigger/>
    </Sidebar.Content>
</Sidebar.Root>