path=$PWD

name=$1
type=$2

if [ -z $name ]; then
  read -p "Insert name to your component: " name
fi

if [ -z $type ]; then
  echo -e "";
  echo -e "Choose type";
  echo -e "1 = Component";
  echo -e "2 = Page";
  read -p "Your choice: " type
fi

TYPE=""
TYPE2=""
if [ $type = "1" ]; then
  TYPE="components"
  TYPE2="COMPONENTS"
elif [ $type = "2" ]; then
  TYPE="pages"
  TYPE2="PAGES"
else
  echo "Failed"
  exit 1
fi

echo "import { useState } from 'react'

// STYLES
import styles from './$name.module.css'

// HOOKS
import { useMainContext } from '../hooks/useMainContext.tsx'

// COMPONENTS

const $name = () => {
  const mainContext = useMainContext();

  return (
    <>
      <h2>$name</h2>
      <p>{mainContext.contextStatus}</p>
    </>
  )
}

export default $name" > $path/src/$TYPE/$name.tsx
echo "" > $path/src/$TYPE/$name.module.css

sed -i "s/\/\/ $TYPE2/\/\/ $TYPE2\nimport $name from '.\/$TYPE\/$name.tsx'/g" $path/src/App.tsx