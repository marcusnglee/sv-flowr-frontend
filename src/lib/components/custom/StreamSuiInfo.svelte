<script lang='ts'>
    import * as Tooltip from '$lib/components/ui/tooltip/index.js';
</script>

<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <img 
                src={'sui_logo.png'} 
                alt="!" 
                class="h-4 w-4 rounded-md object-cover"
            />
        </Tooltip.Trigger>
        <Tooltip.Content class="bg-gray-800 text-white p-2 rounded shadow-lg">
            <p class="font-medium">transparent stream instance info!</p>
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>