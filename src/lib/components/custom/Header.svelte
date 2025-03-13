<script>
    import {Home} from 'lucide-svelte'
    //TODO: menu adjustable for mobile
    //TODO: get signedIn and then change sign in button to profile
    let src = '/flowr.png';
    let navItems = [
      { href: '/about', label: 'About' },
      { href: '/login', label: 'Sign in'}
    ];
  </script>
  
  <header class="bg-gray-100 px-0 py-2">
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center pl-4">
        <img {src} alt='flowr' class="h-8"/>
        <a href='/'>
            <Home/>
        </a>
      </div>
      
      <div class="pr-4">
        <a href="/signin">
          <button class="bg-sunglow hover:bg-yellow-300 text-black font-semibold px-4 py-2 ">
            Sign in
          </button>
        </a>
      </div>
    </div>
  </header>